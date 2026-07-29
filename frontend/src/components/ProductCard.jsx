import { useNavigate } from 'react-router-dom'
import { productImage } from '../data/brand'
import { formatStockLabel } from '../utils/productUnits'

export default function ProductCard({ product, onAddToCart, onViewDetails, showPopularBadge = false }) {
  const navigate = useNavigate()
  const price = Number(product.price).toFixed(2)
  const inStock = product.stock > 0

  const openDetails = () => {
    if (onViewDetails) {
      onViewDetails(product)
      return
    }
    navigate(`/product/${product.id}`)
  }

  return (
    <article
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.35rem] border border-white/80 bg-white/95 shadow-[0_20px_54px_-38px_rgba(10,40,18,0.5)] transition hover:-translate-y-1 hover:shadow-[0_26px_68px_-40px_rgba(10,40,18,0.58)]"
      onClick={openDetails}
    >
      <div className="relative h-36 overflow-hidden bg-[#e8efe5] sm:h-48 lg:h-48">
        <img
          src={productImage(product)}
          alt={product.product_name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = productImage(product)
          }}
        />
        {showPopularBadge && (
          <div className="absolute left-2.5 top-2.5 rounded-full bg-leaf-600 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white shadow-md">
            Popular
          </div>
        )}
        {!showPopularBadge && product.is_featured && (
          <div className="absolute left-2.5 top-2.5 rounded-full bg-leaf-600 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white shadow-md">
            Featured
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-soil-700 sm:text-[11px]">
            {product.category_name}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-soil-700 sm:text-base">
            {product.product_name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-soil-600 sm:text-[13px]">
            {product.description}
          </p>
          <div className="mt-2.5 flex flex-wrap items-baseline gap-1 text-xs sm:text-sm">
            <span className="text-lg font-bold leading-none text-soil-700 sm:text-2xl">INR {price}</span>
            <span className="text-xs font-medium text-soil-700">/ {product.unit}</span>
          </div>
          <p className={`mt-1.5 text-[10px] font-bold sm:text-[11px] ${inStock ? 'text-soil-700' : 'text-clay-600'}`}>
            {formatStockLabel(product)}
          </p>
        </div>

        {/* Buttons Side by Side */}
        <div className="mt-4 grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onAddToCart(product, 1)
            }}
            disabled={!inStock}
            className="add-to-cart-button min-h-10 w-full truncate rounded-xl bg-leaf-600 px-1 py-2 text-[11px] font-bold leading-none transition hover:bg-leaf-700 disabled:cursor-not-allowed disabled:bg-soil-200 disabled:!text-soil-500 sm:text-xs"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              openDetails()
            }}
            className="min-h-10 w-full truncate rounded-xl border border-soil-200 bg-white px-1 py-2 text-[11px] font-bold leading-none text-soil-700 transition hover:bg-soil-50 sm:text-xs"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  )
}
