import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import CartButton from '../components/CartButton'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SiteFooter from '../components/SiteFooter'
import CustomerProfilePanel from '../components/CustomerProfilePanel'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { BRAND_NAME } from '../data/brand'
import { productImage } from '../data/brand'
import { extractErrorMessage } from '../api/client'
import { formatQuantityLabel } from '../utils/productUnits'

export default function CartPage() {
  const navigate = useNavigate()
  const { customer, logout } = useAuth()
  const {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    error,
    refreshCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  const [notice, setNotice] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)

  const deliveryCharge = 0 // cartTotal > 0 && cartTotal < 100 ? 40 : 0
  const grandTotal = Math.max(0, cartTotal + deliveryCharge)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleAction = async (action, successMessage) => {
    try {
      await action()
      setNotice(successMessage)
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
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-soil-200 bg-white text-soil-700 shadow-2xs hover:bg-soil-50 active:scale-95 transition"
              aria-label="Go back"
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
                  Shopping Cart
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



      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-soil-800 sm:text-3xl">My Shopping Cart</h1>
            <p className="mt-1 text-xs text-soil-500 sm:text-sm">
              Review your farm-fresh items before proceeding to delivery details.
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={() => handleAction(clearCart, 'Cart cleared')}
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-red-200 bg-red-50/60 px-3.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 active:scale-95"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear</span>
            </button>
          )}
        </div>

        {loading ? (
          <LoadingState message="Loading your cart items..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refreshCart} />
        ) : cartItems.length === 0 ? (
          <div className="rounded-3xl border border-soil-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-soil-800">Your cart is currently empty</h2>
            <p className="mt-1 text-xs text-soil-500 sm:text-sm">
              Discover fresh milk, fish, eggs, meat, and seafood direct from local farms.
            </p>
            <Link
              to="/customer/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-leaf-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-leaf-700 active:scale-95"
            >
              Explore Fresh Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Cart Items List */}
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border border-soil-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between transition hover:shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-soil-100 bg-[#e8efe5] sm:h-24 sm:w-24">
                      <img
                        src={productImage(item)}
                        alt={item.product_name}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = productImage(item)
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block rounded-md bg-leaf-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-leaf-700">
                        {item.category_name}
                      </span>
                      <h3 className="mt-1 truncate text-base font-bold text-soil-800 sm:text-lg">
                        {item.product_name}
                      </h3>
                      <p className="mt-0.5 text-xs font-semibold text-soil-500">
                        INR {Number(item.price).toFixed(2)} / {item.unit}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          handleAction(() => removeFromCart(item.id), `${item.product_name} removed`)
                        }
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-soil-100 pt-3 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end gap-2">
                    <div className="flex items-center rounded-xl border border-soil-200 bg-soil-50/70 p-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleAction(
                            () => updateQuantity(item.id, item.quantity - 1),
                            'Quantity updated'
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-base font-bold text-soil-700 shadow-2xs hover:bg-soil-100 active:scale-95 transition"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="min-w-8 px-2 text-center text-sm font-bold text-soil-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleAction(
                            () => updateQuantity(item.id, item.quantity + 1),
                            'Quantity updated'
                          )
                        }
                        disabled={item.quantity >= item.stock}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-base font-bold text-soil-700 shadow-2xs hover:bg-soil-100 active:scale-95 transition disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-soil-500 font-semibold">{formatQuantityLabel(item, item.quantity)}</p>
                      <p className="text-base font-bold text-soil-800 sm:text-lg">
                        INR {(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="h-fit rounded-3xl border border-soil-100 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-soil-800">Order Summary</h2>

              {/* Delivery Progress Bar (Removed) */}
              
              <div className="mt-4 space-y-3 border-b border-soil-100 pb-4 text-xs font-semibold text-soil-600 sm:text-sm">
                <div className="flex justify-between">
                  <span>Items Subtotal ({cartCount})</span>
                  <span className="font-bold text-soil-800">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-soil-800">₹{deliveryCharge.toFixed(2)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="mt-5 flex items-baseline justify-between border-t border-soil-100 pt-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-soil-500">Grand Total</p>
                  <p className="text-[10px] text-soil-400">Includes all taxes & delivery fees</p>
                </div>
                <span className="font-display text-2xl font-bold text-leaf-700">
                  INR {grandTotal.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#118707] px-4 py-3.5 text-base font-bold text-white shadow-md shadow-leaf-600/20 transition hover:bg-[#0e7005] active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <Link
                  to="/customer/dashboard"
                  className="flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-soil-200 bg-white px-4 py-2.5 text-xs font-bold text-soil-700 transition hover:bg-soil-50"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-soil-100 pt-4 text-center text-[10px] font-semibold text-soil-500">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base">🚚</span>
                  <span>Farm Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base">🛡️</span>
                  <span>100% Quality</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base">🔒</span>
                  <span>Secure Pay</span>
                </div>
              </div>
            </aside>
          </div>
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
