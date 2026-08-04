import React from 'react'
import { productImage } from '../../data/brand'

export default function OrderItem({ item }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-soil-100 last:border-0 hover:bg-soil-50/50 p-2 -mx-2 rounded-xl transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 flex-shrink-0 bg-soil-100 rounded-xl flex items-center justify-center overflow-hidden shadow-inner border border-soil-200/50">
          <img src={productImage(item)} alt={item.product_name} className="h-full w-full object-cover hover:scale-110 transition-transform duration-500" />
        </div>
        <div>
          <h4 className="font-bold text-soil-900 line-clamp-1">{item.product_name}</h4>
          <p className="text-sm text-soil-500 font-medium mt-0.5">
            {item.unit && <span className="bg-white border border-soil-200 px-1.5 py-0.5 rounded text-[10px] uppercase mr-2">{item.unit}</span>}
            Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}
          </p>
        </div>
      </div>
      <div className="text-right pl-20 sm:pl-0">
        <p className="font-black text-soil-900">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  )
}
