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
      <div className="relative h-48 overflow-hidden bg-[#e8efe5] sm:h-52 lg:h-48">
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
          <div className="absolute left-4 top-4 rounded-full bg-leaf-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
            Popular
          </div>
        )}
        {!showPopularBadge && product.is_featured && (
          <div className="absolute left-4 top-4 rounded-full bg-leaf-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
            Featured
          </div>
        )}
      </div>
      <div className="flex min-h-[238px] flex-1 flex-col p-4">
        <div className="flex-1">
          <p className="min-h-4 text-[11px] font-bold uppercase tracking-[0.16em] text-soil-700">
            {product.category_name}
          </p>
          <h3 className="mt-2 line-clamp-2 min-h-[44px] text-lg font-bold leading-snug text-soil-700">
            {product.product_name}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-[42px] text-[13px] leading-5 text-soil-600">
            {product.description}
          </p>
          <div className="mt-4 flex min-h-[30px] flex-wrap items-end gap-2 text-sm">
            <span className="text-2xl font-bold leading-none text-soil-700">INR {price}</span>
            <span className="pb-0.5 text-sm font-medium text-soil-700">/ {product.unit}</span>
          </div>
          <p className={`mt-2 min-h-4 text-[11px] font-bold ${inStock ? 'text-soil-700' : 'text-clay-600'}`}>
            {formatStockLabel(product)}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onAddToCart(product, 1)
            }}
            disabled={!inStock}
            className="add-to-cart-button min-h-11 whitespace-nowrap rounded-xl bg-leaf-600 px-2 py-2 text-[13px] font-bold leading-none transition hover:bg-leaf-700 disabled:cursor-not-allowed disabled:bg-soil-200 disabled:!text-soil-500"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              openDetails()
            }}
            className="min-h-11 whitespace-nowrap rounded-xl border border-soil-200 bg-white px-2 py-2 text-[13px] font-bold leading-none text-soil-700 transition hover:border-soil-200 hover:text-soil-700"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  )
}
