import { FaCheck, FaClipboardList, FaFileAlt, FaBoxOpen, FaTruck } from 'react-icons/fa'

const steps = [
  { id: 'Pending', label: 'Order Placed', desc: 'Order placed successfully and is pending confirmation.', icon: FaClipboardList },
  { id: 'Confirmed', label: 'Order Confirmed', desc: 'Your order has been confirmed by our team.', icon: FaFileAlt },
  { id: 'Preparing', label: 'Preparing Items', desc: 'Fresh items are being prepared and packed.', icon: FaBoxOpen },
  { id: 'Out for Delivery', label: 'Out for Delivery', desc: 'Your order is on the way.', icon: FaTruck },
  { id: 'Delivered', label: 'Delivered', desc: 'Order has been delivered successfully.', icon: FaCheck },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function currentStepIndex(status) {
  if (status === 'Cancelled') return 0
  const index = steps.findIndex((step) => step.id === status)
  return index >= 0 ? index : 0
}

export default function OrderTimeline({ order }) {
  const activeIndex = currentStepIndex(order.order_status)
  const historyByStatus = new Map((order.history || []).map((entry) => [entry.status, entry.created_at]))

  return (
    <section className="rounded-3xl border border-soil-100 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-8 flex items-center gap-2 text-xl font-black text-soil-900">
        <FaTruck className="text-[#2d6f35]" />
        Order Tracking Timeline
      </h2>

      <div className="mb-10 hidden md:grid md:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index <= activeIndex
          return (
            <div key={step.id} className="relative flex flex-col items-center text-center">
              {index > 0 && (
                <span className={`absolute right-1/2 top-6 h-1 w-full ${index <= activeIndex ? 'bg-[#2d6f35]' : 'bg-soil-100'}`} />
              )}
              <span className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 bg-white text-lg ${
                isActive ? 'border-[#2d6f35]/25 text-[#2d6f35] shadow-[0_0_0_5px_rgba(45,111,53,0.12)]' : 'border-soil-100 text-soil-300'
              }`}>
                <Icon />
              </span>
              <h3 className={`mt-3 text-sm font-extrabold ${isActive ? 'text-soil-900' : 'text-soil-400'}`}>{step.label}</h3>
              {isActive && index === activeIndex && (
                <p className="mt-1 text-xs font-medium text-soil-500">{formatDate(historyByStatus.get(step.id) || order.created_at)}</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="relative space-y-7">
        <span className="absolute left-5 top-4 h-[calc(100%-2rem)] w-0.5 bg-soil-100" />
        <span
          className="absolute left-5 top-4 w-0.5 bg-[#2d6f35]"
          style={{ height: `${(activeIndex / Math.max(steps.length - 1, 1)) * 100}%` }}
        />
        {steps.map((step, index) => {
          const Icon = step.icon
          const isDone = index <= activeIndex
          const time = historyByStatus.get(step.id)
          return (
            <div key={step.id} className="relative flex gap-5">
              <span className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-white ${
                isDone ? 'border-[#2d6f35] text-[#2d6f35]' : 'border-soil-100 text-soil-300'
              }`}>
                <Icon />
              </span>
              <div className={`flex min-w-0 flex-1 items-start justify-between gap-4 pt-1 ${isDone ? '' : 'opacity-55'}`}>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-soil-900">{step.label}</h3>
                    {index === activeIndex && order.order_status !== 'Delivered' && order.order_status !== 'Cancelled' && (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700">In Progress</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-soil-500">{isDone ? step.desc : ''}</p>
                </div>
                {isDone && (
                  <p className="shrink-0 text-xs font-medium text-soil-500">
                    {formatDate(time || order.created_at)}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
