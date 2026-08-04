import { FaCalendarAlt } from 'react-icons/fa'
import OrderActionBar from './OrderActionBar'
import OrderStatusBadge from './OrderStatusBadge'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default function OrderInfoCard({ order }) {
  return (
    <section className="rounded-3xl border border-soil-100 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-soil-400">Order Details</p>
          <h1 className="mt-2 text-xl sm:text-3xl md:text-4xl font-black tracking-tighter text-soil-900 whitespace-nowrap">#{order.order_id}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-soil-500">
            <FaCalendarAlt className="text-soil-400" />
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.order_status} />
      </div>

      <div className="mt-6 border-t border-soil-100 pt-5">
        <OrderActionBar order={order} detail />
      </div>
    </section>
  )
}
