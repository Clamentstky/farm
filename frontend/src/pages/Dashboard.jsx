import { useEffect, useState } from 'react'
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
import { BRAND_NAME, BRAND_TAGLINE, heroSlides, orderedCategories } from '../data/brand'

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

  const loadHome = async () => {
    setLoading(true)
    setError('')
    try {
      const [categoryData, featuredData, popularData] = await Promise.all([
        getCategories(),
        getFeaturedProducts(),
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
      <main>
        <section id="home" className="bg-[#eef7ed] lg:hidden">
          <div className="bg-[#2d6f35] px-4 pb-7 pt-7 text-white">
            <div className="flex items-center justify-between gap-3">
              <Link to="/customer/dashboard" className="flex min-w-0 items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <BrandIcon className="h-10 w-10" />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold text-white">{BRAND_NAME}</h1>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-white/75">
                    Village Farm
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-white/75">
                    Delivery
                  </p>
                </div>
              </Link>

              <div className="flex shrink-0 items-center gap-2">
                <CartButton count={cartCount} to="/cart" />
                <button
                  type="button"
                  onClick={() => setProfileOpen(true)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff3bd] text-2xl font-bold text-[#2d6f35]"
                  aria-label="Open profile details"
                >
                  {avatarLetter}
                </button>
              </div>
            </div>
          </div>

            <div className="-mt-4 px-4 pb-8">
            <nav className="grid grid-cols-4 gap-1 rounded-3xl bg-white/95 p-2 text-center text-[11px] font-bold text-[#6f7f6d] shadow-[0_18px_42px_-28px_rgba(17,135,7,0.75)] ring-1 ring-white">
              <a className="rounded-2xl bg-[#118707] px-2 py-3 text-white shadow-sm" href="#home" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                Home
              </a>
              <a className="rounded-2xl px-2 py-3" href="#categories" onClick={(e) => {e.preventDefault(); document.getElementById('categories')?.scrollIntoView({behavior: 'smooth', block: 'start'});}}>
                Categories
              </a>
              <a className="rounded-2xl px-2 py-3" href="#featured" onClick={(e) => {e.preventDefault(); document.getElementById('featured')?.scrollIntoView({behavior: 'smooth', block: 'start'});}}>
                Featured
              </a>
              <a className="rounded-2xl px-2 py-3" href="#popular" onClick={(e) => {e.preventDefault(); document.getElementById('popular')?.scrollIntoView({behavior: 'smooth', block: 'start'});}}>
                Popular
              </a>
            </nav>

            <div className="relative mt-5 aspect-[1719/915] overflow-hidden rounded-3xl bg-soil-700 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.65)]">
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
                <div className="flex gap-2 rounded-full bg-white/70 px-3 py-2 shadow-sm">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeSlide ? 'w-8 bg-leaf-600' : 'w-2.5 bg-soil-300'
                      }`}
                      aria-label={`Show ${slide.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <label htmlFor="mobile_product_search" className="sr-only">
              Search by product or category
            </label>
            <div className="mt-5 flex min-h-[70px] items-center gap-3 rounded-2xl bg-white px-5 shadow-[0_18px_44px_-30px_rgba(17,135,7,0.8)]">
              <SearchIcon />
              <input
                id="mobile_product_search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search milk, fish, eggs..."
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-soil-700 placeholder:text-soil-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchTerm(searchTerm.trim())}
                className="rounded-2xl bg-[#118707] px-5 py-3 text-sm font-bold text-white"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="hidden bg-[#eef7ed] lg:block">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
            <header className="rounded-2xl bg-white px-4 py-3 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.65)]">
              <div className="flex items-center justify-between gap-3">
                <Link to="/customer/dashboard" className="flex min-w-0 items-center gap-3">
                  <BrandIcon className="h-10 w-10" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">
                      {BRAND_NAME}
                    </p>
                    <h1 className="truncate font-display text-xl font-semibold text-soil-700">
                      {BRAND_TAGLINE}
                    </h1>
                  </div>
                </Link>

                <nav className="hidden items-center gap-6 text-sm font-bold text-soil-600 lg:flex">
                  <a className="hover:text-leaf-700" href="#home">Home</a>
                  <a className="hover:text-leaf-700" href="#categories">Categories</a>
                  <a className="hover:text-leaf-700" href="#featured">Featured</a>
                  <a className="hover:text-leaf-700" href="#popular">Popular</a>
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

              <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl bg-soil-50 p-1 text-center text-sm font-bold text-soil-600 lg:hidden">
                <a className="rounded-lg px-2 py-2 hover:bg-white hover:text-leaf-700" href="#home">Home</a>
                <a className="rounded-lg px-2 py-2 hover:bg-white hover:text-leaf-700" href="#categories">Category</a>
                <a className="rounded-lg px-2 py-2 hover:bg-white hover:text-leaf-700" href="#featured">Featured</a>
                <a className="rounded-lg px-2 py-2 hover:bg-white hover:text-leaf-700" href="#popular">Popular</a>
              </div>
            </header>

            <div className="relative mt-5 h-[360px] overflow-hidden rounded-3xl bg-soil-700 shadow-[0_20px_50px_-32px_rgba(0,0,0,0.65)] xl:h-[390px]">
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
                <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-sm">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide.title}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeSlide ? 'w-8 bg-leaf-600' : 'w-2.5 bg-soil-300'
                      }`}
                      aria-label={`Show ${slide.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:pt-10">
          <label htmlFor="product_search" className="sr-only">
            Search by product or category
          </label>
          <div className="-mt-2 mb-8 hidden flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:flex">
            <div className="flex min-h-[58px] w-full items-center gap-3 rounded-xl bg-white px-4 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.55)] ring-1 ring-soil-100 sm:max-w-xl">
              <SearchIcon />
              <input
                id="product_search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search milk, fish, prawn, eggs..."
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-soil-700 placeholder:text-soil-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setSearchTerm(searchTerm.trim())}
              className="min-h-[58px] rounded-xl bg-leaf-600 px-8 text-sm font-bold text-white shadow-[0_12px_30px_-16px_rgba(17,135,7,0.85)] transition hover:bg-leaf-700 sm:w-auto"
            >
              Search
            </button>
          </div>

          {notice && (
            <div className="fixed right-4 top-28 z-40 rounded-lg bg-soil-700 px-4 py-3 text-sm font-bold text-white shadow-lg">
              {notice}
            </div>
          )}

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={loadHome} />
          ) : (
            <>
              {hasSearch && (
                <section className="mb-10">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="font-display text-2xl font-semibold text-soil-700">
                      Search Results
                    </h2>
                    <span className="text-sm font-bold text-leaf-600">
                      {searching ? 'Searching...' : `${searchResults.length} items`}
                    </span>
                  </div>
                  {searching ? (
                    <LoadingState message="Searching products..." />
                  ) : searchResults.length > 0 ? (
                    <ProductGrid
                      products={searchResults}
                      onAddToCart={handleAddToCart}
                    />
                  ) : (
                    <EmptyState message="No products matched your search." />
                  )}
                </section>
              )}

              <section id="categories" className="mb-10 scroll-mt-36">
                <div className="rounded-[2rem] bg-[#eef7ed] px-4 py-7 shadow-[0_28px_80px_-54px_rgba(10,40,18,0.55)] sm:px-6 lg:px-8">
                  <div className="mb-6 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-soil-500">
                        Farm Essentials
                      </p>
                      <h2 className="mt-2 whitespace-nowrap font-display text-2xl font-semibold text-soil-700 sm:mt-3 sm:text-3xl">
                        Shop by Category
                      </h2>
                    </div>
                    <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-soil-600 shadow-sm">
                      {displayCategories.length} categories
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
                    {displayCategories.map((category) => (
                      <CategoryCard key={category.id} category={category} />
                    ))}
                  </div>
                </div>
              </section>

              <section id="featured" className="mb-10 scroll-mt-36">
                <SectionTitle title="Featured Products" detail="Fresh picks highlighted for today." />
                <ProductGrid
                  products={featuredProducts}
                  onAddToCart={handleAddToCart}
                  scrollOnMobile
                />
              </section>

              <section id="popular" className="scroll-mt-36">
                <SectionTitle title="Popular Products" detail="High-stock essentials customers buy often." />
                <ProductGrid
                  products={popularProducts}
                  onAddToCart={handleAddToCart}
                  scrollOnMobile
                  showPopularBadge={true}
                />
              </section>
            </>
          )}
        </div>
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

function SectionTitle({ title, detail }) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold text-soil-700">{title}</h2>
        <p className="mt-1 text-sm text-soil-500">{detail}</p>
      </div>
    </div>
  )
}

function ProductGrid({ products, onAddToCart, onViewDetails, scrollOnMobile = false, showPopularBadge = false }) {
  if (!products.length) return <EmptyState message="No products available." />

  if (scrollOnMobile) {
    return (
      <div className="flex snap-x gap-3 overflow-x-auto px-2 pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
        {products.map((product) => (
          <div key={product.id} className="h-full w-[66vw] max-w-[260px] shrink-0 snap-start sm:w-auto sm:max-w-none">
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
              showPopularBadge={showPopularBadge}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
          showPopularBadge={showPopularBadge}
        />
      ))}
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="rounded-lg border border-soil-100 bg-white p-8 text-center text-sm font-semibold text-soil-500">
      {message}
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
