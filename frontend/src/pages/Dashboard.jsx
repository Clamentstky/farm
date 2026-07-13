import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BrandIcon from '../components/BrandIcon'

const products = [
  {
    name: 'Cow Milk',
    category: 'Milk',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=75',
  },
  {
    name: 'Goat Milk',
    category: 'Milk',
    image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=600&q=75',
  },
  {
    name: 'Fresh Water Fish',
    category: 'Fish',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=600&q=75',
  },
  {
    name: 'Sea Fish',
    category: 'Fish',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=75',
  },
  {
    name: 'Fresh Water Prawn',
    category: 'Prawn',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=75',
  },
  {
    name: 'Sea Prawn',
    category: 'Prawn',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=75',
  },
  {
    name: 'Country Chicken',
    category: 'Chicken',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=75',
  },
  {
    name: 'Broiler Chicken',
    category: 'Chicken',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=75',
  },
  {
    name: 'Country Eggs',
    category: 'Eggs',
    image: '/product-images/country-eggs.svg',
  },
  {
    name: 'White Eggs',
    category: 'Eggs',
    image: '/product-images/white-eggs.svg',
  },
  {
    name: 'Quail Eggs',
    category: 'Eggs',
    image: '/product-images/quail-eggs.svg',
  },
  {
    name: 'Duck Eggs',
    category: 'Eggs',
    image: '/product-images/duck-eggs.svg',
  },
  {
    name: 'Goat Meat',
    category: 'Meat',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=75',
  },
  {
    name: 'Other Farm Products',
    category: 'Farm Fresh',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=75',
  },
]

const quickStats = [
  { label: 'Fresh items', value: '14+' },
  { label: 'Delivery slot', value: 'Morning' },
  { label: 'Orders', value: '0' },
]

export default function Dashboard() {
  const { customer, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')
  const [location, setLocation] = useState(customer?.village || '')
  const [locationStatus, setLocationStatus] = useState('')
  const [locating, setLocating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleUseCurrentLocation = () => {
    setLocationStatus('')

    if (!navigator.geolocation) {
      setLocationStatus('Location is not supported on this device.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
        setLocationStatus('Current location added for delivery.')
        setLocating(false)
      },
      () => {
        setLocationStatus('Unable to get location. Please allow permission or use your village.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const initials = customer?.full_name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
    .toUpperCase()

  const filteredProducts = products.filter((product) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true
    return `${product.name} ${product.category}`.toLowerCase().includes(query)
  })

  return (
    <div className="app-shell min-h-screen bg-soil-50">
      <header className="sticky top-0 z-10 border-b border-soil-100 bg-white/95 px-5 pb-4 pt-5 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <BrandIcon className="h-11 w-11" />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">GraminFresh</p>
              <h1 className="truncate font-display text-2xl font-semibold text-soil-700">
                Hi, {customer?.full_name?.split(' ')[0] || 'Customer'}
              </h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 rounded-xl border border-soil-200 bg-white px-3 py-2 text-sm font-semibold text-soil-600 active:bg-soil-100"
          >
            Logout
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-leaf-400/30 bg-leaf-600 px-4 py-3 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf-100">Deliver to</p>
              <p className="mt-1 break-words text-sm font-semibold">{location || 'Add your delivery location'}</p>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className="shrink-0 rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold disabled:opacity-70"
            >
              {locating ? 'Finding' : 'Use GPS'}
            </button>
          </div>
          {locationStatus && <p className="mt-2 text-xs text-leaf-100">{locationStatus}</p>}
        </div>
      </header>

      <main className="px-5 pb-24 pt-5">
        {activeTab === 'home' ? (
          <>
            <section className="mb-5 rounded-2xl bg-white p-4 shadow-sm shadow-soil-200/60">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-soil-500">Customer ID</p>
                  <p className="mt-1 font-mono text-lg font-bold text-soil-700">{customer?.customer_id}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-soil-100 text-lg font-bold text-leaf-700">
                  {initials || 'GF'}
                </div>
              </div>
            </section>

            <section className="mb-5 grid grid-cols-3 gap-3">
              {quickStats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white px-3 py-4 text-center shadow-sm shadow-soil-200/50">
                  <p className="text-lg font-bold text-leaf-700">{item.value}</p>
                  <p className="mt-1 text-[11px] font-medium leading-tight text-soil-500">{item.label}</p>
                </div>
              ))}
            </section>

            <section className="mb-5">
              <label htmlFor="product_search" className="sr-only">
                Search products
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-soil-100 bg-white px-4 py-3 shadow-sm shadow-soil-200/40">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-soil-400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m20 20-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  id="product_search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search milk, fish, eggs..."
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-soil-700 placeholder:text-soil-400 focus:outline-none"
                />
              </div>
            </section>

            <section className="mb-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-soil-700">Fresh products</h2>
                <span className="text-xs font-semibold text-leaf-600">{filteredProducts.length} items</span>
              </div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.name}
                      type="button"
                      className="overflow-hidden rounded-2xl border border-soil-100 bg-white text-left shadow-sm shadow-soil-200/40 active:border-leaf-400"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-soil-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <span className="block text-sm font-bold leading-snug text-soil-700">{product.name}</span>
                        <span className="mt-1 block text-xs font-semibold text-leaf-600">{product.category}</span>
                        <span className="mt-2 block text-xs font-medium text-soil-500">Available soon</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-soil-100 bg-white p-5 text-center text-sm font-semibold text-soil-500">
                  No products found
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="rounded-2xl bg-white p-5 shadow-sm shadow-soil-200/60">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-600 text-xl font-bold text-white">
                {initials || 'GF'}
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-display text-2xl font-semibold text-soil-700">{customer?.full_name}</h2>
                <p className="font-mono text-sm font-semibold text-leaf-700">{customer?.customer_id}</p>
              </div>
            </div>

            <dl className="space-y-4 text-sm">
              <div className="border-b border-soil-100 pb-4">
                <dt className="font-semibold text-soil-500">Mobile Number</dt>
                <dd className="mt-1 text-base font-semibold text-soil-700">{customer?.mobile_number}</dd>
              </div>
              <div className="border-b border-soil-100 pb-4">
                <dt className="font-semibold text-soil-500">Email Address</dt>
                <dd className="mt-1 break-words text-base font-semibold text-soil-700">
                  {customer?.email || '-'}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-soil-500">Village / Location</dt>
                <dd className="mt-1 break-words text-base font-semibold text-soil-700">
                  {customer?.village || '-'}
                </dd>
              </div>
            </dl>
          </section>
        )}
      </main>

      <nav className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-[480px] -translate-x-1/2 grid-cols-2 border-t border-soil-100 bg-white px-5 py-3">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`rounded-xl py-3 text-sm font-bold ${activeTab === 'home' ? 'bg-leaf-600 text-white' : 'text-soil-500'}`}
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`rounded-xl py-3 text-sm font-bold ${activeTab === 'profile' ? 'bg-leaf-600 text-white' : 'text-soil-500'}`}
        >
          Profile
        </button>
      </nav>
    </div>
  )
}
