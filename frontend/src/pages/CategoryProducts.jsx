import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import ProductDetailsModal from '../components/ProductDetailsModal'
import SiteFooter from '../components/SiteFooter'
import CustomerProfilePanel from '../components/CustomerProfilePanel'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { extractErrorMessage } from '../api/client'
import { getCategories, getProductsByCategory } from '../api/catalog'
import { BRAND_NAME, BRAND_TAGLINE, categoryImage } from '../data/brand'

export default function CategoryProducts() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { customer, logout } = useAuth()
  const { cartCount, addToCart } = useCart()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const selectedCategory = categories.find((category) => String(category.id) === String(id))
  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return products
    return products.filter((product) =>
      `${product.product_name} ${product.category_name}`.toLowerCase().includes(query)
    )
  }, [products, searchTerm])
  const loadCategory = async () => {
    setLoading(true)
    setError('')
    try {
      const [categoryData, productData] = await Promise.all([
        getCategories(),
        getProductsByCategory(id),
      ])
      setCategories(categoryData)
      setProducts(productData)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategory()
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [id])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    setNotice(`${product.product_name} added to cart`)
    window.setTimeout(() => setNotice(''), 1800)
  }
  const avatarLetter = customer?.full_name?.charAt(0)?.toUpperCase() || BRAND_NAME.charAt(0)

  return (
    <div className="min-h-screen bg-soil-50 text-soil-700">
      <header className="sticky top-0 z-30 border-b border-soil-100 bg-white/95 shadow-sm shadow-soil-100/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/customer/dashboard" className="flex min-w-0 items-center gap-3">
              <BrandIcon className="h-10 w-10 sm:h-11 sm:w-11" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">
                  {BRAND_NAME}
                </p>
                <h1 className="truncate font-display text-xl font-semibold text-soil-700 sm:text-2xl">{BRAND_TAGLINE}</h1>
              </div>
            </Link>
            <div className="flex shrink-0 items-center justify-end gap-2">
              <Link
                to="/cart"
                className="rounded-full border border-leaf-500/30 bg-leaf-600/10 px-3 py-2 text-sm font-bold text-leaf-700"
              >
                My Cart {cartCount}
              </Link>
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3bd] text-base font-bold text-[#118707]"
                aria-label="Open profile details"
              >
                {avatarLetter}
              </button>
            </div>
          </div>
          <div className="grid w-full grid-cols-3 gap-2 rounded-xl bg-soil-50 p-1 text-center text-sm font-bold text-soil-600">
            <Link to="/customer/dashboard" className="rounded-lg px-2 py-2 transition hover:bg-white hover:text-leaf-700">
              Home
            </Link>
            <a href="#products" className="rounded-lg px-2 py-2 transition hover:bg-white hover:text-leaf-700">
              Products
            </a>
            <a href="#browse-categories" className="rounded-lg px-2 py-2 transition hover:bg-white hover:text-leaf-700">
              Categories
            </a>
          </div>
          <label htmlFor="category_search" className="sr-only">Search within this category</label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex min-h-[54px] w-full items-center gap-3 rounded-xl bg-white px-4 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.55)] ring-1 ring-soil-100">
              <SearchIcon />
              <input
                id="category_search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search within this category..."
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-soil-700 placeholder:text-soil-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setSearchTerm(searchTerm.trim())}
              className="min-h-[54px] rounded-xl bg-leaf-600 px-8 text-sm font-bold text-white shadow-[0_12px_30px_-16px_rgba(17,135,7,0.85)] transition hover:bg-leaf-700"
            >
              Search
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {notice && (
          <div className="fixed right-4 top-28 z-40 rounded-lg bg-soil-700 px-4 py-3 text-sm font-bold text-white shadow-lg">
            {notice}
          </div>
        )}

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={loadCategory} />
        ) : (
          <>
            <section className="mb-8 overflow-hidden rounded-lg border border-soil-100 bg-white shadow-sm shadow-soil-100">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <img
                  src={categoryImage(selectedCategory)}
                  alt={selectedCategory?.category_name || 'Selected category'}
                  className="h-44 w-full object-cover sm:h-56 lg:h-72"
                />
                <div className="flex flex-col justify-center p-5 sm:p-7">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf-600">
                    Category products
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-soil-700 sm:text-4xl">
                    {selectedCategory?.category_name || 'Products'}
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-soil-600">
                    Browse all available products in this category with price, unit and live stock details.
                  </p>
                  <p className="mt-4 text-sm font-bold text-leaf-700">
                    {filteredProducts.length} products available
                  </p>
                </div>
              </div>
            </section>

            <section id="products" className="mb-10 scroll-mt-36">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold text-soil-700">
                  Product List
                </h2>
                <span className="text-sm font-bold text-leaf-600">
                  {searchTerm ? 'Filtered' : 'All items'}
                </span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetails={setSelectedProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-soil-100 bg-white p-8 text-center text-sm font-semibold text-soil-500">
                  No products found in this category.
                </div>
              )}
            </section>

            <section id="browse-categories" className="scroll-mt-40">
              <div className="mb-4">
                <h2 className="font-display text-2xl font-semibold text-soil-700">
                  Browse Other Categories
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <SiteFooter compact />

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <CustomerProfilePanel
        customer={customer}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0 text-soil-400" fill="none">
      <path
        d="m20 20-4.2-4.2m1.2-5A6.2 6.2 0 1 1 4.6 10.8a6.2 6.2 0 0 1 12.4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
