import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import CartButton from '../components/CartButton'
import ProductCard from '../components/ProductCard'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import SiteFooter from '../components/SiteFooter'
import CustomerProfilePanel from '../components/CustomerProfilePanel'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { extractErrorMessage } from '../api/client'
import { getCategories, getProductsByCategory } from '../api/catalog'
import { BRAND_NAME } from '../data/brand'

export default function CategoryProducts() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { customer, logout } = useAuth()
  const { cartCount, addToCart } = useCart()

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const selectedCategory = categories.find((category) => String(category.id) === String(id))

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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
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

  return (
    <div className="min-h-screen bg-soil-50 text-soil-700">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed right-4 top-24 z-50 flex items-center gap-2 rounded-2xl bg-soil-800 px-4 py-3 text-xs font-bold text-white shadow-2xl animate-fade-in">
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {notice}
        </div>
      )}

      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 border-b border-soil-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/customer/dashboard')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-soil-200 bg-white text-soil-700 shadow-2xs hover:bg-soil-50 active:scale-95 transition"
              aria-label="Back to dashboard"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <Link to="/customer/dashboard" className="flex items-center gap-2.5">
              <BrandIcon className="h-9 w-9" />
              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-soil-800">{BRAND_NAME}</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-leaf-600">
                  {selectedCategory?.category_name || 'Category'}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <CartButton count={cartCount} to="/cart" />
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3bd] text-lg font-bold text-[#118707] shadow-2xs transition hover:scale-105"
              aria-label="Open profile details"
            >
              {avatarLetter}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={loadCategory} />
        ) : (
          <>
            {/* Minimal Header Title with Product Count */}
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-soil-200/80 pb-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-soil-800 sm:text-3xl">
                  {selectedCategory?.category_name || 'Category'}
                </h1>
                <p className="mt-1 text-xs font-semibold text-soil-500">
                  {products.length} {products.length === 1 ? 'item available' : 'items available'}
                </p>
              </div>
            </div>

            {/* Products One-by-One Vertical Stack (1 Column) */}
            <section className="mb-12">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-soil-100 bg-white p-12 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-soil-100 text-soil-400">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-soil-700">No products found</h3>
                  <p className="mt-1 text-xs text-soil-500">There are currently no products available in this category.</p>
                  <Link
                    to="/customer/dashboard"
                    className="mt-5 inline-block rounded-xl bg-leaf-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-leaf-700"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              )}
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
