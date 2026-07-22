import { useState } from 'react'
import { productImage } from '../data/brand'
import { formatStockLabel } from '../utils/productUnits'

export default function ProductDetailsModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product)
    }
    setQuantity(1)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-soil-700/40 p-3 sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl font-bold text-soil-600 shadow-md"
          aria-label="Close product details"
        >
          ×
        </button>

        {/* Back Link */}
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 px-5 pt-4 text-sm font-medium text-leaf-600 hover:text-leaf-700"
        >
          ← Back
        </button>

        <div className="grid gap-6 p-5 sm:grid-cols-[1fr_1.1fr]">
          {/* Product Image Section */}
          <div className="flex items-center justify-center bg-gradient-to-br from-soil-50 to-soil-100 rounded-lg overflow-hidden">
            <img
              src={productImage(product)}
              alt={product.product_name}
              className="h-80 w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = productImage(product)
              }}
            />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-between">
            {/* Header */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-leaf-600">
                {product.category_name}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-soil-800">
                {product.product_name}
              </h2>

              {/* Price Section */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-leaf-600">
                  ₹{Number(product.price).toFixed(0)}
                </span>
                <span className="text-sm text-soil-500">
                  /{product.unit}
                </span>
              </div>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-700">
                  ✓ Freshest Guaranteed
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  🚚 Delivery Available in your area within 24 hours
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm leading-6 text-soil-600">
                {product.description}
              </p>

              {/* Availability */}
              <div className="mt-4 rounded-lg bg-soil-50 p-3">
                <p className="text-sm font-semibold text-soil-600">
                  Availability: <span className="font-bold text-leaf-700">{formatStockLabel(product)}</span>
                </p>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="mt-6 space-y-3">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between rounded-lg border border-soil-200 p-3">
                <span className="text-sm font-medium text-soil-700">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="flex h-7 w-7 items-center justify-center rounded border border-soil-300 text-soil-600 hover:bg-soil-50 disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-semibold text-soil-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="flex h-7 w-7 items-center justify-center rounded border border-soil-300 text-soil-600 hover:bg-soil-50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="rounded-lg border-2 border-leaf-600 px-4 py-3 font-bold text-leaf-600 transition hover:bg-leaf-50 disabled:border-soil-200 disabled:text-soil-400"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="rounded-lg bg-leaf-600 px-4 py-3 font-bold text-white transition hover:bg-leaf-700 disabled:bg-soil-200 disabled:text-soil-400"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
