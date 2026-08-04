import { FaClipboardList } from 'react-icons/fa'

export default function OrderStats({ orders }) {
  return (
    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-soil-100 bg-white/70 px-4 py-2 text-sm font-bold text-[#2d6f35] shadow-sm">
      <FaClipboardList className="text-xs" />
      {orders.length} Total Orders
    </div>
  )
}
