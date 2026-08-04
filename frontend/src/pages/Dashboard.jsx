import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import {
  getCategories,
  getFeaturedProducts,
  getPopularProducts,
  getProducts,
} from '../api/catalog'
import { extractErrorMessage } from '../api/client'
import { BRAND_NAME, BRAND_TAGLINE, heroSlides, orderedCategories, productImage } from '../data/brand'

export default function Dashboard() {
  const { customer, logout } = useAuth()
  const { cartCount, addToCart } = useCart()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [popularProducts, setPopularProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const sections = ['home', 'categories', 'featured', 'popular']

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i])
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadHome = async () => {
    setLoading(true)
    setError('')
    try {
      const [categoryData, featuredData, popularData] = await Promise.all([
        getCategories(),
        getProducts(),
        getPopularProducts(),
      ])
      setCategories(categoryData)
      setFeaturedProducts(featuredData)
      setPopularProducts(popularData)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHome()
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % heroSlides.length)
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const query = searchTerm.trim()
    if (!query) {
      setSearchResults([])
      setSearching(false)
      return
    }

    const timeoutId = window.setTimeout(async () => {
      setSearching(true)
      try {
        const data = await getProducts(query)
        setSearchResults(data)
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

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

  const hasSearch = searchTerm.trim().length > 0
  const avatarLetter = customer?.full_name?.charAt(0)?.toUpperCase() || BRAND_NAME.charAt(0)
  const displayCategories = orderedCategories(categories)

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

      {/* Desktop Sticky Header */}
      <header className="sticky top-0 z-40 hidden border-b border-soil-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Link to="/customer/dashboard" className="flex min-w-0 items-center gap-3">
            <BrandIcon className="h-10 w-10" />
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf-700">
                {BRAND_NAME}
              </p>
              <h1 className="truncate font-display text-base font-semibold text-soil-700">
                {BRAND_TAGLINE}
              </h1>
            </div>
          </Link>

          {/* Sticky 4 Navigation Options */}
          <nav className="flex items-center gap-1 rounded-2xl bg-soil-100/70 p-1 text-sm font-bold text-soil-600">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`rounded-xl px-4 py-1.5 transition ${
                activeSection === 'home'
                  ? 'bg-leaf-600 text-white shadow-xs'
                  : 'hover:text-leaf-700'
              }`}
            >
              Home
            </a>
            <a
              href="#categories"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`rounded-xl px-4 py-1.5 transition ${
                activeSection === 'categories'
                  ? 'bg-leaf-600 text-white shadow-xs'
                  : 'hover:text-leaf-700'
              }`}
            >
              Categories
            </a>
            <a
              href="#featured"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`rounded-xl px-4 py-1.5 transition ${
                activeSection === 'featured'
                  ? 'bg-leaf-600 text-white shadow-xs'
                  : 'hover:text-leaf-700'
              }`}
            >
              Featured
            </a>
            <a
              href="#popular"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`rounded-xl px-4 py-1.5 transition ${
                activeSection === 'popular'
                  ? 'bg-leaf-600 text-white shadow-xs'
                  : 'hover:text-leaf-700'
              }`}
            >
              Popular
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <CartButton count={cartCount} to="/cart" />
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff3bd] text-lg font-bold text-[#118707]"
              aria-label="Open profile details"
            >
              {avatarLetter}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Header Bar: Stays fixed at the top all the way down to the footer */}
      <header className="sticky top-0 z-40 bg-[#2d6f35] shadow-md backdrop-blur-md lg:hidden">
        <div className="px-4 pb-2 pt-3 text-white">
          <div className="flex items-center justify-between gap-3">
            <Link to="/customer/dashboard" className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <BrandIcon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-white">{BRAND_NAME}</h1>
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-white/75">
                  Village Farm Delivery
                </p>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <CartButton count={cartCount} to="/cart" />
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff3bd] text-lg font-bold text-[#2d6f35]"
                aria-label="Open profile details"
              >
                {avatarLetter}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Navigation Options Pill Bar */}
        <div className="px-3 pb-2.5 pt-1">
          <nav className="grid grid-cols-4 gap-1 rounded-2xl bg-white/95 p-1 text-center text-[11px] font-bold text-[#6f7f6d] shadow-sm">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`rounded-xl px-1 py-1.5 transition ${
                activeSection === 'home'
                  ? 'bg-[#118707] text-white shadow-xs'
                  : 'hover:bg-leaf-50 hover:text-leaf-700'
              }`}
            >
              Home
            </a>
            <a
              href="#categories"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`rounded-xl px-1 py-1.5 transition ${
                activeSection === 'categories'
                  ? 'bg-[#118707] text-white shadow-xs'
                  : 'hover:bg-leaf-50 hover:text-leaf-700'
              }`}
            >
              Categories
            </a>
            <a
              href="#featured"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`rounded-xl px-1 py-1.5 transition ${
                activeSection === 'featured'
                  ? 'bg-[#118707] text-white shadow-xs'
                  : 'hover:bg-leaf-50 hover:text-leaf-700'
              }`}
            >
              Featured
            </a>
            <a
              href="#popular"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`rounded-xl px-1 py-1.5 transition ${
                activeSection === 'popular'
                  ? 'bg-[#118707] text-white shadow-xs'
                  : 'hover:bg-leaf-50 hover:text-leaf-700'
              }`}
            >
              Popular
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-[#eef7ed] lg:hidden">
        <div className="px-4 pb-6 pt-3">
          {/* Mobile Hero Slider */}
          <div className="relative aspect-[1719/915] overflow-hidden rounded-3xl bg-soil-700 shadow-md">
            {heroSlides.map((slide, index) => (
              <img
                key={slide.image}
                src={slide.image}
                alt={slide.title}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  index === activeSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-x-0 bottom-3 flex justify-center">
              <div className="flex gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeSlide ? 'w-6 bg-leaf-600' : 'w-2 bg-soil-300'
                    }`}
                    aria-label={`Show slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-4 relative">
            <div className="flex min-h-[54px] items-center gap-3 rounded-2xl bg-white px-4 shadow-sm">
              <SearchIcon />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search milk, fish, eggs..."
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-soil-700 placeholder:text-soil-400 focus:outline-none"
              />
            </div>
            
            {hasSearch && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-soil-100 bg-white shadow-xl">
                <ul className="max-h-[300px] overflow-y-auto">
                  {searchResults.slice(0, 5).map(product => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('')
                          handleAddToCart(product, 1)
                        }}
                        className="w-full flex items-center gap-3 border-b border-soil-50 p-3 text-left hover:bg-soil-50 transition"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-soil-100">
                          <img src={productImage(product)} alt={product.product_name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-soil-900 text-sm truncate">{product.product_name}</p>
                          <p className="text-xs font-medium text-soil-500 mt-0.5 truncate">
                            ₹{product.price} • {product.unit}
                          </p>
                        </div>
                        <div className="text-xs font-bold text-leaf-600 bg-leaf-50 px-3 py-1.5 rounded-full shrink-0">
                          + Add
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={loadHome} />
        ) : hasSearch ? (
          <section className="mb-12">
            <SectionTitle
              title={`Search Results (${searchResults.length})`}
              detail={`Showing results for "${searchTerm}"`}
            />
            {searching ? (
              <LoadingState />
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-soil-100 bg-white p-12 text-center text-sm font-bold text-soil-500">
                No products found matching "{searchTerm}".
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Desktop Hero Slider */}
            <div className="hidden lg:block mb-8 relative h-[360px] overflow-hidden rounded-3xl bg-soil-700 shadow-md xl:h-[390px]">
              {heroSlides.map((slide, index) => (
                <img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    index === activeSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <div className="flex gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeSlide ? 'w-8 bg-leaf-600' : 'w-2.5 bg-soil-300'
                      }`}
                      aria-label={`Show slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Categories Section */}
            <section id="categories" className="mb-12 scroll-mt-24">
              <SectionTitle
                title="Browse Categories"
                detail="Fresh products direct from village suppliers."
              />
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
                {displayCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </section>

            {/* Featured Fresh Products Horizontal Side-Scroll Carousel */}
            <ProductCarouselSection
              id="featured"
              title="Featured Fresh Products"
              detail="Handpicked fresh items from our local farm partners."
              products={featuredProducts}
              onAddToCart={handleAddToCart}
            />

            {/* Popular Products Horizontal Side-Scroll Carousel */}
            <ProductCarouselSection
              id="popular"
              title="Popular Products"
              detail="High-demand farm essentials customers order daily."
              products={popularProducts}
              onAddToCart={handleAddToCart}
              showPopularBadge
            />
          </>
        )}
      </main>

      <SiteFooter />

      <CustomerProfilePanel
        customer={customer}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  )
}

function ProductCarouselSection({ id, title, detail, products, onAddToCart, showPopularBadge = false }) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <div className="mb-4">
        <h2 className="font-display text-xl font-bold text-soil-800 sm:text-2xl">{title}</h2>
        {detail && <p className="mt-0.5 text-xs text-soil-500 sm:text-sm">{detail}</p>}
      </div>

      <div
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="w-[270px] sm:w-[290px] shrink-0 snap-start">
            <ProductCard product={product} onAddToCart={onAddToCart} showPopularBadge={showPopularBadge} />
          </div>
        ))}
      </div>
    </section>
  )
}

function SectionTitle({ title, detail }) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-xl font-bold text-soil-800 sm:text-2xl">{title}</h2>
        {detail && <p className="mt-0.5 text-xs text-soil-500 sm:text-sm">{detail}</p>}
      </div>
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
