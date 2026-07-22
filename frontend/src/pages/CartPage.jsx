import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import CartButton from '../components/CartButton'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import SiteFooter from '../components/SiteFooter'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'
import { productImage } from '../data/brand'
import { extractErrorMessage } from '../api/client'
import { formatQuantityLabel } from '../utils/productUnits'

export default function CartPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
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
  const deliveryCharge = cartTotal > 0 && cartTotal < 500 ? 40 : 0
  const grandTotal = cartTotal + deliveryCharge

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

  return (
    <div className="min-h-screen bg-soil-50 text-soil-700">
      <header className="sticky top-0 z-30 border-b border-soil-100 bg-white/95 shadow-sm shadow-soil-100/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
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
          <div className="flex shrink-0 items-center gap-2">
            <CartButton count={cartCount} to="/cart" />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-soil-200 bg-white px-3 py-2 text-sm font-bold text-soil-600 hover:border-leaf-400"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {notice && (
          <div className="fixed right-4 top-24 z-40 rounded-lg bg-soil-700 px-4 py-3 text-sm font-bold text-white shadow-lg">
            {notice}
          </div>
        )}

        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-semibold text-soil-700">My Cart</h2>
            <p className="mt-1 text-sm font-medium text-soil-500">
              Review your selected farm products.
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={() => handleAction(clearCart, 'Cart cleared')}
              className="rounded-lg border border-soil-200 bg-white px-4 py-2 text-sm font-bold text-soil-600"
            >
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <LoadingState message="Loading your cart..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refreshCart} />
        ) : cartItems.length === 0 ? (
          <div className="rounded-lg border border-soil-100 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-soil-500">Your cart is empty.</p>
            <Link
              to="/customer/dashboard"
              className="mt-4 inline-flex rounded-lg bg-leaf-600 px-5 py-3 text-sm font-bold text-white"
            >
              Shop Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-3">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[92px_1fr] gap-3 rounded-lg border border-soil-100 bg-white p-3 shadow-sm sm:grid-cols-[120px_1fr_auto]"
                >
                  <img
                    src={productImage(item)}
                    alt={item.product_name}
                    className="h-24 w-full rounded-md object-cover sm:h-28"
                    onError={(event) => {
                      event.currentTarget.src = productImage(item)
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-leaf-600">
                      {item.category_name}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-soil-700">
                      {item.product_name}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-soil-700">
                      INR {Number(item.price).toFixed(2)} / {item.unit}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleAction(() => removeFromCart(item.id), `${item.product_name} removed`)
                      }
                      className="mt-2 text-sm font-bold text-clay-600"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
                    <div className="flex items-center overflow-hidden rounded-lg border border-soil-200 bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          handleAction(
                            () => updateQuantity(item.id, item.quantity - 1),
                            'Quantity updated'
                          )
                        }
                        className="h-9 w-9 text-lg font-bold text-soil-700"
                      >
                        -
                      </button>
                      <span className="min-w-10 px-3 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleAction(
                            () => updateQuantity(item.id, item.quantity + 1),
                            'Quantity updated'
                          )
                        }
                        disabled={item.quantity >= item.stock}
                        className="h-9 w-9 text-lg font-bold text-soil-700"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-bold text-soil-700">
                      {formatQuantityLabel(item, item.quantity)} |{' '}
                      INR {(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-lg border border-soil-100 bg-white p-5 shadow-sm">
              <h3 className="font-display text-xl font-semibold text-soil-700">Order Summary</h3>
              <div className="mt-4 grid gap-3 text-sm font-bold text-soil-600">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{cartCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span>INR {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{deliveryCharge ? `INR ${deliveryCharge.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="flex justify-between border-t border-soil-100 pt-3 text-base text-soil-700">
                  <span>Grand Total</span>
                  <span>INR {grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                <Link
                  to="/customer/dashboard"
                  className="rounded-lg border border-soil-200 bg-white px-4 py-3 text-center text-sm font-bold text-soil-700"
                >
                  Continue Shopping
                </Link>
                <button
                  type="button"
                  onClick={() => navigate('/checkout/address')}
                  className="rounded-lg bg-leaf-600 px-4 py-3 text-sm font-bold text-white"
                >
                  Proceed to Checkout
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>

      <SiteFooter compact />
    </div>
  )
}
