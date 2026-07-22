import { useNavigate } from 'react-router-dom'
import { productImage } from '../data/brand'
import { formatQuantityLabel } from '../utils/productUnits'

export default function CartDrawer({ items, open, onClose }) {
  const navigate = useNavigate()
  if (!open) return null

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  )

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/35 p-3 sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <section
        className="ml-auto flex h-full w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl sm:h-auto sm:max-h-[88vh]"
        onClick={(event) => event.stopPropagation()}
        aria-label="Cart"
      >
        <div className="flex items-center justify-between border-b border-soil-100 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-600">
              My Cart
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-soil-700">
              {cartCount} items
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-soil-100 bg-white text-lg font-bold leading-none text-soil-700"
            aria-label="Close cart"
          >
            x
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length > 0 ? (
            <div className="grid gap-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[72px_1fr] gap-3 rounded-lg border border-soil-100 bg-soil-50/70 p-2"
                >
                  <img
                    src={productImage(item)}
                    alt={item.product_name}
                    className="h-20 w-full rounded-md object-cover"
                    onError={(event) => {
                      event.currentTarget.src = productImage(item)
                    }}
                  />
                  <div className="min-w-0 py-1">
                    <p className="truncate text-sm font-bold text-soil-700">
                      {item.product_name}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-soil-400">
                      {item.category_name}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-soil-600">
                        Qty {item.quantity} ({formatQuantityLabel(item, item.quantity)})
                      </span>
                      <span className="font-bold text-soil-700">
                        INR {(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-soil-100 bg-soil-50 p-8 text-center">
              <p className="font-display text-xl font-semibold text-soil-700">
                Your cart is empty
              </p>
              <p className="mt-2 text-sm leading-6 text-soil-500">
                Add fresh products from the list and they will show here.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-soil-100 px-5 py-4">
          <div className="flex items-center justify-between text-base font-bold text-soil-700">
            <span>Subtotal</span>
            <span>INR {subtotal.toFixed(2)}</span>
          </div>
          <button
            type="button"
            disabled={!items.length}
            onClick={() => {
              onClose()
              navigate('/checkout/address')
            }}
            className="mt-4 w-full rounded-lg bg-leaf-600 px-4 py-3 text-sm font-bold text-white disabled:bg-soil-200 disabled:text-soil-500"
          >
            Checkout
          </button>
        </div>
      </section>
    </div>
  )
}
