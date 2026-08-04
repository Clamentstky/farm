import { FaBoxOpen } from 'react-icons/fa'
import { productImage } from '../../data/brand'

function money(value) {
  return `₹${Number(value || 0).toFixed(2)}`
}

export default function OrderItems({ order }) {
  return (
    <section className="rounded-3xl border border-soil-100 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-soil-900">
        <FaBoxOpen className="text-[#2d6f35]" />
        Items in this Order ({order.items?.length || 0})
      </h2>

      <div className="space-y-3">
        {order.items?.map((item) => (
          <div key={item.id || item.product_id} className="flex items-center gap-4 rounded-2xl border border-soil-100 bg-[#f7fbf5] p-4">
            <img
              src={productImage(item.product || item)}
              alt={item.product_name}
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-extrabold text-soil-900">{item.product_name}</h3>
              {item.unit && (
                <span className="mt-2 inline-flex rounded-md bg-[#e7efe7] px-2 py-1 text-xs font-black text-soil-600">
                  {item.unit}
                </span>
              )}
              <p className="mt-2 text-xs font-medium text-soil-500">
                {money(item.price)} × {item.quantity}
              </p>
            </div>
            <p className="shrink-0 text-lg font-black text-soil-900">{money(Number(item.price) * Number(item.quantity))}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
