import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import SiteFooter from '../components/SiteFooter'
import { useCart } from '../context/CartContext'
import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'

const TAMIL_NADU_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
  'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
  'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
  'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
  'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
]

export default function CheckoutAddress() {
  const navigate = useNavigate()
  const { cartItems, cartCount, cartTotal } = useCart()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
  })

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const deliveryCharge = cartTotal > 0 && cartTotal < 100 ? 40 : 0
  const grandTotal = cartTotal + deliveryCharge

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/checkout/payment', { state: { address: form } })
  }

  return (
    <div className="min-h-screen bg-[#eef7ed] text-soil-700">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/customer/dashboard" className="flex items-center gap-3">
            <BrandIcon className="h-10 w-10 sm:h-11 sm:w-11" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">{BRAND_NAME}</p>
              <h1 className="font-display text-lg font-bold text-soil-800 sm:text-xl">{BRAND_TAGLINE}</h1>
            </div>
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-1.5 rounded-full border border-leaf-200 bg-leaf-50 px-4 py-2 text-xs font-bold text-leaf-700 transition hover:bg-leaf-100"
          >
            ← Back to Cart
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Step Progress Tracker */}
        <div className="mb-8">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-600 text-xs font-bold text-white shadow-md">
                1
              </div>
              <span className="text-xs font-bold text-leaf-700">Address</span>
            </div>
            <div className="h-0.5 flex-1 bg-soil-200 mx-2" />
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-soil-200 text-xs font-bold text-soil-500">
                2
              </div>
              <span className="text-xs font-semibold text-soil-400">Payment</span>
            </div>
            <div className="h-0.5 flex-1 bg-soil-200 mx-2" />
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-soil-200 text-xs font-bold text-soil-500">
                3
              </div>
              <span className="text-xs font-semibold text-soil-400">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Address Form Card */}
          <section className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 border-b border-soil-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-soil-800">Delivery Address</h2>
                <p className="text-xs text-soil-500">Enter where you would like your farm order delivered.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-soil-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={10}
                    className="w-full rounded-2xl border border-soil-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                  Street Address / House No *
                </label>
                <textarea
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full rounded-2xl border border-soil-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                  placeholder="House No, Building, Street Name, Area"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    City / Town *
                  </label>
                  <input
                    required
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-soil-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    placeholder="City or Town"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    District *
                  </label>
                  <select
                    required
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                  >
                    <option value="" disabled>Select District</option>
                    {TAMIL_NADU_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    PIN Code *
                  </label>
                  <input
                    required
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className="w-full rounded-2xl border border-soil-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-leaf-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-leaf-600/30 transition hover:bg-leaf-700 active:scale-98"
                >
                  Continue to Payment →
                </button>
              </div>
            </form>
          </section>

          {/* Order Summary Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
              <h3 className="font-display text-xl font-bold text-soil-800 border-b border-soil-100 pb-3">
                Order Summary
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-xs sm:text-sm text-soil-600">
                  <span>Items ({cartCount})</span>
                  <span className="font-bold text-soil-800">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-soil-600">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-soil-800">
                    {deliveryCharge ? `₹${deliveryCharge.toFixed(2)}` : 'FREE'}
                  </span>
                </div>

                <div className="flex justify-between border-t border-soil-100 pt-3 text-base font-bold text-soil-800">
                  <span>Grand Total</span>
                  <span className="font-display text-xl text-leaf-700">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter compact />
    </div>
  )
}
