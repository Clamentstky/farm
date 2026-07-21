import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SiteFooter from '../components/SiteFooter'
import { extractErrorMessage } from '../api/client'
import { getProductDetails, getRelatedProducts, getSimilarProducts } from '../api/catalog'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { productImage, productImages } from '../data/brand'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [similarProducts, setSimilarProducts] = useState([])
  const [activeImage, setActiveImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const gallery = useMemo(() => productImages(product), [product])
  const inStock = product?.stock > 0
  const maxQuantity = Math.max(1, product?.stock || 1)

  const loadProduct = async () => {
    setLoading(true)
    setError('')
    try {
      const [productData, relatedData, similarData] = await Promise.all([
        getProductDetails(id),
        getRelatedProducts(id),
        getSimilarProducts(id),
      ])
      setProduct(productData)
      setRelatedProducts(relatedData)
      setSimilarProducts(similarData)
      setActiveImage(productImages(productData)[0])
      setQuantity(1)
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProduct()
  }, [id])

  useEffect(() => {
    if (gallery.length <= 1) return undefined

    const carouselId = window.setInterval(() => {
      setActiveImage((currentImage) => {
        const currentIndex = gallery.indexOf(currentImage)
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % gallery.length : 0
        return gallery[nextIndex]
      })
    }, 3000)

    return () => window.clearInterval(carouselId)
  }, [gallery])

  const showNotice = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2200)
  }

  const handleAddToCart = async (item = product, itemQuantity = quantity) => {
    if (!item) return false
    setActionLoading(true)
    try {
      await addToCart(item, itemQuantity)
      showNotice(`${item.product_name} added to cart`)
      return true
    } catch (err) {
      showNotice(extractErrorMessage(err))
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const handleBuyNow = async () => {
    const added = await handleAddToCart(product, quantity)
    if (added) {
      navigate('/cart')
    }
  }

  const updateQuantity = (nextQuantity) => {
    setQuantity(Math.min(maxQuantity, Math.max(1, nextQuantity)))
  }

  return (
    <div className="min-h-screen bg-[#eef7ed] text-soil-700">
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        {notice && (
          <div className="fixed right-4 top-24 z-40 rounded-lg bg-soil-700 px-4 py-3 text-sm font-bold text-white shadow-lg">
            {notice}
          </div>
        )}

        {loading ? (
          <LoadingState message="Loading product details..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadProduct} />
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-[0_16px_46px_-34px_rgba(10,40,18,0.55)] lg:mb-5">
              <button
                type="button"
                onClick={() => navigate(product?.category_id ? `/category/${product.category_id}` : '/customer/dashboard')}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-soil-100 bg-white text-lg font-bold text-soil-700"
                aria-label="Back to products"
              >
                {'<'}
              </button>
              <span className="text-sm font-bold text-soil-700">Product Details</span>
            </div>

            <section className="rounded-[1.6rem] border border-white/80 bg-white/80 p-5 shadow-[0_28px_80px_-52px_rgba(10,40,18,0.65)] sm:p-6 lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-10 xl:p-7">
              <div>
                <div className="relative aspect-[4/3] max-h-[420px] overflow-hidden rounded-2xl bg-[#e8efe5] lg:max-h-[380px] xl:max-h-[420px]">
                  {gallery.map((image) => (
                    <img
                      key={image}
                      src={image}
                      alt={product.product_name}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                        activeImage === image ? 'opacity-100' : 'opacity-0'
                      }`}
                      onError={(event) => {
                        event.currentTarget.src = productImage(product)
                      }}
                    />
                  ))}
                  {gallery.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/75 px-3 py-2">
                      {gallery.map((image) => (
                        <button
                          key={image}
                          type="button"
                          onClick={() => setActiveImage(image)}
                          className={`h-2 rounded-full transition-all ${
                            activeImage === image ? 'w-6 bg-leaf-600' : 'w-2 bg-soil-200'
                          }`}
                          aria-label="Show product image"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {gallery.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-white p-1 ${
                        activeImage === image ? 'border-soil-700' : 'border-soil-100'
                      }`}
                      aria-label="Show product image"
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full rounded-lg object-cover"
                        onError={(event) => {
                          event.currentTarget.src = productImage(product)
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <article className="mt-6 flex flex-col justify-center lg:mt-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-soil-500">
                  {product.category_name}
                </p>
                <h1 className="mt-2 max-w-full break-words font-display text-3xl font-semibold leading-tight text-soil-700 lg:text-[1.9rem]">
                  {product.product_name}
                </h1>
                <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-soil-500 lg:line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-6 flex flex-wrap items-end gap-2 lg:mt-5">
                  <span className="text-3xl font-bold text-soil-700">
                    INR {Number(product.price).toFixed(2)}
                  </span>
                  <span className="pb-1 text-xs font-bold text-soil-500">/ {product.unit}</span>
                </div>
                <p className="mt-2 text-xs font-bold text-soil-500">
                  {product.stock} units available
                </p>

                <div className="mt-4 grid max-w-xs gap-3 lg:gap-2">
                  <InfoTile label="Freshness" value={product.freshness_info} />
                  <InfoTile label="Delivery" value={product.delivery_availability} />
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-bold text-soil-700">Quantity</span>
                    <div className="flex h-8 w-28 items-center justify-between rounded-lg border border-soil-100 bg-white px-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                      className="h-full w-8 text-base font-bold text-soil-700 disabled:text-soil-300"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(quantity + 1)}
                      disabled={quantity >= maxQuantity}
                      className="h-full w-8 text-base font-bold text-soil-700 disabled:text-soil-300"
                    >
                      +
                    </button>
                    </div>
                    <span className="text-xs font-bold text-soil-500">
                      {quantity} {product.unit}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product, quantity)}
                      disabled={!inStock || actionLoading}
                      className="add-to-cart-button min-h-12 rounded-xl bg-leaf-600 px-5 text-sm font-bold transition hover:bg-leaf-700 disabled:bg-soil-200 disabled:!text-soil-500"
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={!inStock || actionLoading}
                      className="min-h-12 rounded-xl border border-leaf-600 bg-white px-5 text-sm font-bold text-soil-700 transition hover:bg-leaf-600/10 disabled:border-soil-200 disabled:text-soil-400"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            </section>

            <ProductSection
              eyebrow="More from this category"
              title="Related Products"
              products={relatedProducts}
              onAddToCart={handleAddToCart}
            />
            <ProductSection
              eyebrow="Customer favourites"
              title="Browse More Products"
              products={similarProducts}
              onAddToCart={handleAddToCart}
              showBrowseAll
            />
          </>
        )}
      </main>

      <SiteFooter compact />
    </div>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-lg border border-soil-100 bg-white/70 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-soil-500">{label}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-soil-700">{value}</p>
    </div>
  )
}

function ProductSection({ eyebrow, title, products, onAddToCart, showBrowseAll = false }) {
  if (!products.length) return null

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-soil-500">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-soil-700">{title}</h2>
        </div>
        <span className="rounded-full bg-white/60 px-4 py-2 text-xs font-bold text-soil-500">
          {products.length} to explore
        </span>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <CompactProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
      {showBrowseAll && (
        <Link
          to="/customer/dashboard"
          className="mt-5 inline-flex min-h-10 items-center rounded-xl border border-soil-200 bg-white px-8 text-sm font-bold text-soil-700"
        >
          Browse all products
        </Link>
      )}
    </section>
  )
}

function CompactProductCard({ product, onAddToCart }) {
  const navigate = useNavigate()
  const inStock = product.stock > 0

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.2rem] border border-white/80 bg-white/90 shadow-[0_20px_54px_-40px_rgba(10,40,18,0.55)]">
      <button
        type="button"
        onClick={() => navigate(`/product/${product.id}`)}
        className="block w-full text-left"
      >
        <img
          src={productImage(product)}
          alt={product.product_name}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = productImage(product)
          }}
        />
      </button>
      <div className="flex min-h-[245px] flex-1 flex-col p-4">
        <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-soil-500">
          {product.category_name}
        </p>
        <h3 className="mt-2 line-clamp-2 min-h-[44px] text-lg font-bold leading-snug text-soil-700">
          {product.product_name}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm font-medium leading-5 text-soil-500">
          {product.description}
        </p>
        </div>
        <div className="mt-5 flex min-h-[30px] items-end justify-between gap-3">
          <div>
            <span className="text-xl font-bold text-soil-700">
              INR {Number(product.price).toFixed(2)}
            </span>
            <span className="ml-1 text-xs font-bold text-soil-500">/ {product.unit}</span>
          </div>
          <span className="pb-1 text-[11px] font-bold text-soil-500">
            {product.stock} available
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate(`/product/${product.id}`)}
            className="min-h-10 rounded-xl border border-soil-200 bg-white text-xs font-bold text-soil-700"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onAddToCart(product, 1)}
            disabled={!inStock}
            className="add-to-cart-button min-h-10 rounded-xl bg-leaf-600 text-xs font-bold disabled:bg-soil-200 disabled:!text-soil-500"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}
