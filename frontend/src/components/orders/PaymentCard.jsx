import React from 'react'
import { FaCreditCard, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa'

export default function PaymentCard({ order }) {
  const rawSubtotal = parseFloat(order.total_amount) - parseFloat(order.delivery_charge) + parseFloat(order.discount || 0)
  const simulatedTax = rawSubtotal * 0.05
  const baseSubtotal = rawSubtotal - simulatedTax
  const platformFee = 2.00
  const grandTotal = parseFloat(order.total_amount) + platformFee

  const isPaid = order.payment_method !== 'Cash on Delivery'

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-soil-100">
      <h3 className="font-bold text-soil-900 mb-6 text-lg">Payment Summary</h3>
      
      <div className="space-y-4 mb-6 pb-6 border-b border-soil-100">
        <div className="flex justify-between text-sm">
          <span className="text-soil-500">Subtotal (excl. Tax)</span>
          <span className="font-semibold text-soil-900">₹{baseSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-soil-500">Tax (5% GST)</span>
          <span className="font-semibold text-soil-900">₹{simulatedTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-soil-500">Delivery Charge</span>
          <span className="font-semibold text-soil-900">₹{parseFloat(order.delivery_charge).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-soil-500">Platform Fee</span>
          <span className="font-semibold text-soil-900">₹{platformFee.toFixed(2)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm text-leaf-600 font-medium">
            <span>Coupon Discount</span>
            <span>-₹{parseFloat(order.discount).toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-bold text-soil-900">Grand Total</span>
        <span className="text-2xl font-black text-soil-900">₹{grandTotal.toFixed(2)}</span>
      </div>

      <div className="bg-soil-50 rounded-2xl p-5 border border-soil-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-leaf-600 shadow-sm border border-soil-100">
              {isPaid ? <FaCreditCard /> : <FaMoneyBillWave />}
            </div>
            <div>
              <p className="text-xs text-soil-500 font-medium mb-0.5">Method</p>
              <p className="text-sm font-bold text-soil-900">{order.payment_method}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-soil-500 font-medium mb-0.5">Status</p>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {isPaid && <FaCheckCircle />} {isPaid ? 'Paid' : 'Pending'}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
