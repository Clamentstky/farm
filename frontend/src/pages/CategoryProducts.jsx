import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import CartButton from '../components/CartButton'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import SiteFooter from '../components/SiteFooter'
import CustomerProfilePanel from '../components/CustomerProfilePanel'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { extractErrorMessage } from '../api/client'
import { getCategories, getProductsByCategory } from '../api/catalog'
import { BRAND_NAME, BRAND_TAGLINE, orderedCategories } from '../data/brand'

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

  const handleAddToCart = async (product, quantity = 1) => {
    try {
      await addToCart(product, quantity)
      setNotice(`${product.product_name} added to cart`)
      window.setTimeout(() => setNotice(''), 1800)
    } catch (err) {
      setNotice(extractErrorMessage(err))
      window.setTimeout(() => setNotice(''), 2200)
    }
  }
  const avatarLetter = customer?.full_name?.charAt(0)?.toUpperCase() || BRAND_NAME.charAt(0)
  const displayCategories = orderedCategories(categories)

  return (
    <div className="min-h-screen bg-[#eef7ed] text-soil-700">
      <header className="z-30 border-b border-white/70 bg-white/90 shadow-sm shadow-soil-100/70 backdrop-blur">
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
              <CartButton count={cartCount} to="/cart" />
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
          <div className="grid w-full grid-cols-3 gap-2 rounded-2xl bg-[#f6faf4] p-1 text-center text-sm font-bold text-soil-600">
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
            <section id="products" className="mb-12 scroll-mt-36">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-soil-500">
                    Fresh Picks
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-soil-700">
                    {selectedCategory?.category_name || 'Product List'}
                  </h2>
                </div>
                <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-soil-600">
                  {filteredProducts.length} available
                </span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-soil-100 bg-white p-8 text-center text-sm font-semibold text-soil-500">
                  No products found in this category.
                </div>
              )}
            </section>

            <section id="browse-categories" className="scroll-mt-40 rounded-[2rem] bg-white/60 px-4 py-7 sm:px-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-soil-500">
                    More categories
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-soil-700">
                    Browse Other Categories
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
                {displayCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <SiteFooter compact />

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
