import { productImage } from '../data/brand'

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  const price = Number(product.price).toFixed(2)
  const inStock = product.stock > 0

  const openDetails = () => onViewDetails(product)

  return (
    <article
      className="cursor-pointer overflow-hidden rounded-lg border border-soil-100 bg-white shadow-sm shadow-soil-200/50 transition hover:border-leaf-400"
      onClick={openDetails}
    >
      <div className="aspect-[16/10] overflow-hidden bg-soil-100 sm:aspect-[5/3]">
        <img
          src={productImage(product)}
          alt={product.product_name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex min-h-[178px] flex-col p-3">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-leaf-600">
            {product.category_name}
          </p>
          <h3 className="mt-1 text-base font-bold leading-snug text-soil-700">
            {product.product_name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-soil-500">
            {product.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold text-soil-700">INR {price}</span>
            <span className="text-soil-400">/ {product.unit}</span>
          </div>
          <p className={`mt-2 text-xs font-semibold ${inStock ? 'text-leaf-700' : 'text-clay-600'}`}>
            {inStock ? `${product.stock} ${product.unit} in stock` : 'Out of stock'}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onAddToCart(product)
            }}
            disabled={!inStock}
            className="rounded-lg bg-leaf-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-leaf-700 disabled:cursor-not-allowed disabled:bg-soil-200 disabled:text-soil-500"
          >
            Add
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              openDetails()
            }}
            className="rounded-lg border border-soil-200 bg-white px-3 py-2 text-sm font-bold text-soil-700 transition hover:border-leaf-400 hover:text-leaf-700"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  )
}
