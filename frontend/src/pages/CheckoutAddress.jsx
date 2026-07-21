import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import PrimaryButton from '../components/PrimaryButton'
import SiteFooter from '../components/SiteFooter'
import { useCart } from '../context/CartContext'
import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'

export default function CheckoutAddress() {
  const navigate = useNavigate()
  const { cartItems, cartCount, cartTotal } = useCart()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const deliveryCharge = cartTotal > 0 && cartTotal < 500 ? 40 : 0
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
    <div className="min-h-screen bg-soil-50 text-soil-700">
      <header className="border-b border-soil-100 bg-white/95 shadow-sm shadow-soil-100/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/customer/dashboard" className="flex items-center gap-3">
            <BrandIcon className="h-10 w-10" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">{BRAND_NAME}</p>
              <h1 className="font-display text-lg font-semibold text-soil-700">{BRAND_TAGLINE}</h1>
            </div>
          </Link>
          <Link to="/cart" className="rounded-full border border-leaf-500/30 bg-leaf-600/10 px-3 py-2 text-sm font-bold text-leaf-700">
            Back to Cart
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="rounded-2xl border border-soil-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf-600">Step 1 of 3</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-soil-700">Delivery address</h2>
          <p className="mt-2 text-sm text-soil-500">Add the address where your farm order should be delivered.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-soil-700">
                Full name
                <input
                  required
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-3 text-sm outline-none focus:border-leaf-500"
                  placeholder="Riya Sharma"
                />
              </label>
              <label className="text-sm font-semibold text-soil-700">
                Phone number
                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-3 text-sm outline-none focus:border-leaf-500"
                  placeholder="9876543210"
                />
              </label>
            </div>

            <label className="block text-sm font-semibold text-soil-700">
              Street address
              <textarea
                required
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className="mt-2 w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-3 text-sm outline-none focus:border-leaf-500"
                placeholder="House No, Street, Landmark"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-soil-700">
                City
                <input
                  required
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-3 text-sm outline-none focus:border-leaf-500"
                  placeholder="Bengaluru"
                />
              </label>
              <label className="text-sm font-semibold text-soil-700">
                PIN code
                <input
                  required
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-3 text-sm outline-none focus:border-leaf-500"
                  placeholder="560001"
                />
              </label>
            </div>

            <PrimaryButton type="submit">Continue to payment</PrimaryButton>
          </form>
        </section>

        <aside className="rounded-2xl border border-soil-100 bg-white p-6 shadow-sm">
          <h3 className="font-display text-xl font-semibold text-soil-700">Order summary</h3>
          <div className="mt-4 space-y-3 text-sm font-semibold text-soil-600">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{cartCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>INR {cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryCharge ? `INR ${deliveryCharge.toFixed(2)}` : 'Free'}</span>
            </div>
            <div className="flex justify-between border-t border-soil-100 pt-3 text-base text-soil-700">
              <span>Total</span>
              <span>INR {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </main>

      <SiteFooter compact />
    </div>
  )
}
