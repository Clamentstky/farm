import { FaCreditCard } from 'react-icons/fa'

function money(value) {
  return `₹${Number(value || 0).toFixed(2)}`
}

export default function PaymentSummary({ order }) {
  const delivery = Number(order.delivery_charge || 0)
  const discount = Number(order.discount || 0)
  const total = Number(order.total_amount || 0)
  const subtotal = total - delivery + discount
  const isPaid = order.payment_method !== 'Cash on Delivery'

  return (
    <section className="rounded-3xl border border-soil-100 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-soil-900">
        <FaCreditCard className="text-[#2d6f35]" />
        Payment & Bill Summary
      </h2>

      <div className="space-y-4 text-sm font-medium">
        <div className="flex items-center justify-between gap-4">
          <span className="text-soil-500">Payment Method</span>
          <span className="rounded-lg bg-[#eef3ee] px-3 py-1.5 text-xs font-black text-[#2d6f35]">
            {order.payment_method || 'Cash on Delivery (COD)'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-soil-500">Payment Status</span>
          <span className="font-black text-[#2d6f35]">{isPaid ? 'Paid' : 'Pay on Delivery'}</span>
        </div>

        <div className="border-t border-dashed border-soil-200 pt-4">
          <div className="flex justify-between py-2 text-soil-600">
            <span>Items Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 text-soil-600">
            <span>Delivery Charge</span>
            <span>{delivery === 0 ? 'FREE' : money(delivery)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between py-2 text-emerald-700">
              <span>Discount</span>
              <span>-{money(discount)}</span>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between border-t border-dashed border-soil-200 pt-5">
          <span className="text-base font-black text-soil-900">Grand Total</span>
          <span className="text-3xl font-black tracking-tight text-[#2d6f35]">{money(total)}</span>
        </div>
      </div>
    </section>
  )
}
