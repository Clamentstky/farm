import { Link, useNavigate } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import SiteFooter from '../components/SiteFooter'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'
import { productImage } from '../data/brand'

export default function CartPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
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
            <Link
              to="/cart"
              className="rounded-full border border-leaf-500/30 bg-leaf-600/10 px-3 py-2 text-sm font-bold text-leaf-700"
            >
              My Cart {cartCount}
            </Link>
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
              onClick={clearCart}
              className="rounded-lg border border-soil-200 bg-white px-4 py-2 text-sm font-bold text-soil-600"
            >
              Clear
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
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
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 text-sm font-bold text-clay-600"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
                    <div className="flex items-center overflow-hidden rounded-lg border border-soil-200 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-9 w-9 text-lg font-bold text-soil-700"
                      >
                        -
                      </button>
                      <span className="min-w-10 px-3 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-9 w-9 text-lg font-bold text-soil-700"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-bold text-soil-700">
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
                  <span>Items</span>
                  <span>{cartCount}</span>
                </div>
                <div className="flex justify-between border-t border-soil-100 pt-3 text-base text-soil-700">
                  <span>Total</span>
                  <span>INR {cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <SiteFooter compact />
    </div>
  )
}
