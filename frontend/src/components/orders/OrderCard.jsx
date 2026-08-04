import { FaCalendarAlt, FaClock, FaCheckCircle, FaSpinner, FaTruck, FaTimesCircle } from 'react-icons/fa'
import { productImage } from '../../data/brand'
import OrderActionBar from './OrderActionBar'

const statusStyles = {
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  Confirmed: 'border-blue-200 bg-blue-50 text-blue-700',
  Preparing: 'border-orange-200 bg-orange-50 text-orange-700',
  'Out for Delivery': 'border-purple-200 bg-purple-50 text-purple-700',
  Delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Cancelled: 'border-red-200 bg-red-50 text-red-700',
}

const statusIcons = {
  Pending: FaClock,
  Confirmed: FaCheckCircle,
  Preparing: FaSpinner,
  'Out for Delivery': FaTruck,
  Delivered: FaCheckCircle,
  Cancelled: FaTimesCircle,
}

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

function money(value) {
  return `₹${Number(value || 0).toFixed(2)}`
}

export default function OrderCard({ order }) {
  const StatusIcon = statusIcons[order.order_status] || FaClock
  const itemCount = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0

  return (
    <article className="rounded-3xl border border-soil-100 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-soil-400">Order ID</p>
          <h2 className="mt-1 text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-soil-900 whitespace-nowrap">#{order.order_id}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-soil-500">
            <FaCalendarAlt className="text-xs text-soil-400" />
            {formatDate(order.created_at)}
          </p>
        </div>

        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold ${statusStyles[order.order_status] || statusStyles.Pending}`}>
          <StatusIcon className={order.order_status === 'Preparing' ? 'animate-spin' : ''} />
          {order.order_status}
        </span>
      </div>

      <div className="divide-y divide-soil-100 border-y border-soil-100">
        {order.items?.map((item) => (
          <div key={item.id || item.product_id} className="flex items-center gap-3 py-3">
            <img
              src={productImage(item.product || item)}
              alt={item.product_name}
              className="h-12 w-12 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-extrabold text-soil-900">{item.product_name}</h3>
              <p className="mt-0.5 text-xs font-medium text-soil-500">
                Qty: {item.quantity} {item.unit ? `(${item.unit})` : ''} • {money(item.price)} each
              </p>
            </div>
            <p className="shrink-0 text-sm font-black text-soil-900">{money(Number(item.price) * Number(item.quantity))}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-md bg-[#eef3ee] px-2.5 py-1 text-xs font-bold text-soil-600">
          Payment: <strong className="text-soil-900">{order.payment_method || 'Cash on Delivery (COD)'}</strong>
        </span>
        <span className="rounded-md bg-[#eef3ee] px-2.5 py-1 text-xs font-bold text-soil-600">
          Items: <strong className="text-soil-900">{itemCount} Units</strong>
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-soil-400">Total Amount</p>
          <p className="text-2xl font-black text-[#2d6f35]">{money(order.total_amount)}</p>
        </div>
        <OrderActionBar order={order} />
      </div>
    </article>
  )
}
