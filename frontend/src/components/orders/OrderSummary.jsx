import React from 'react'

export default function OrderSummary({ order }) {
  const subtotal = Number(order.total_amount) - Number(order.delivery_charge) + Number(order.discount || 0)
  const delivery = Number(order.delivery_charge)
  const discount = Number(order.discount || 0)
  const total = Number(order.total_amount)

  return (
    <div className="bg-soil-50 p-5 rounded-xl border border-soil-200">
      <h3 className="font-bold text-soil-900 mb-4 text-sm uppercase tracking-wider">Payment Summary</h3>
      
      <div className="space-y-3 text-sm font-medium text-soil-700">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Delivery Charge</span>
          <span className="font-bold text-soil-900">
            ₹{delivery.toFixed(2)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="pt-3 border-t border-soil-200 flex justify-between items-center font-black text-lg text-soil-900">
          <span>Grand Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-soil-200">
        <div className="flex justify-between items-center text-xs font-bold text-soil-500 uppercase tracking-wider">
          <span>Payment Method</span>
          <span className="text-soil-900">{order.payment_method}</span>
        </div>
      </div>
    </div>
  )
}
