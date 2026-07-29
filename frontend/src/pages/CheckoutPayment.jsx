import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import PrimaryButton from '../components/PrimaryButton'
import SiteFooter from '../components/SiteFooter'
import { useCart } from '../context/CartContext'
import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'

export default function CheckoutPayment() {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart, cartItems, cartCount, cartTotal } = useCart()
  const address = location.state?.address
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')

  if (!address || cartItems.length === 0) {
    return <Navigate to="/checkout/address" replace />
  }

  const deliveryCharge = cartTotal > 0 && cartTotal < 100 ? 40 : 0
  const grandTotal = cartTotal + deliveryCharge

  const handleSubmit = async (event) => {
    event.preventDefault()
    await clearCart()
    navigate('/checkout/success', { state: { address, paymentMethod } })
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
          <Link to="/checkout/address" className="rounded-full border border-leaf-500/30 bg-leaf-600/10 px-3 py-2 text-sm font-bold text-leaf-700">
            Back to Address
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="rounded-2xl border border-soil-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf-600">Step 2 of 3</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-soil-700">Payment</h2>
          <p className="mt-2 text-sm text-soil-500">Choose a payment method to confirm your fresh-order pickup.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="rounded-xl border border-soil-200 bg-soil-50 p-4">
              <p className="text-sm font-semibold text-soil-700">Delivery to</p>
              <p className="mt-2 text-sm text-soil-600">{address.fullName} · {address.address}</p>
              <p className="text-sm text-soil-600">{address.city} - {address.pincode}</p>
            </div>

            <div className="space-y-3">
              {['Cash on Delivery', 'UPI', 'Card'].map((method) => (
                <label key={method} className="flex items-center gap-3 rounded-xl border border-soil-200 bg-white px-4 py-3 text-sm font-semibold text-soil-700">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="h-4 w-4 border-soil-300 text-leaf-600"
                  />
                  {method}
                </label>
              ))}
            </div>

            <PrimaryButton type="submit">Place order</PrimaryButton>
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
