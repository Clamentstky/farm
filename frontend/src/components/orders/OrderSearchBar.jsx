import { FaSearch, FaClock, FaCheckCircle, FaSpinner, FaTruck, FaTimesCircle } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS_TABS = [
  { value: 'All', label: 'All Orders' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
]

const statusIcons = {
  Pending: FaClock,
  Confirmed: FaCheckCircle,
  Preparing: FaSpinner,
  'Out for Delivery': FaTruck,
  Delivered: FaCheckCircle,
  Cancelled: FaTimesCircle,
}

function money(value) {
  return `₹${Number(value || 0).toFixed(2)}`
}

export default function OrderSearchBar({ filters, setFilters, orders = [] }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const query = (filters.search || '').trim().toLowerCase()
  const matchingOrders = query ? orders.filter(o => {
    return (o.order_id?.toString().toLowerCase() || '').includes(query) ||
      o.items?.some(i => (i.product_name || '').toLowerCase().includes(query))
  }).slice(0, 5) : []

  return (
    <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-2 px-2 md:mx-0 md:px-0 md:pb-0 md:flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, status: tab.value }))}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-extrabold transition ${
              filters.status === tab.value
                ? 'border-[#055205] bg-[#055205] text-white shadow-md shadow-[#055205]/20'
                : 'border-soil-100 bg-white text-soil-500 hover:border-soil-200 hover:text-soil-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative w-full md:max-w-sm" ref={dropdownRef}>
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-soil-400" />
        <input
          type="search"
          className="h-11 w-full rounded-xl border border-soil-200 bg-white py-2 pl-11 pr-4 text-base font-extrabold text-soil-900 shadow-sm transition placeholder:text-soil-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="Search by Order ID or Product name"
          value={filters.search}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, search: e.target.value }))
            setShowDropdown(true)
          }}
          onFocus={() => {
            if (filters.search.trim()) setShowDropdown(true)
          }}
        />
        
        <AnimatePresence>
          {showDropdown && query && matchingOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-soil-100 bg-white shadow-xl"
            >
              <ul className="max-h-[300px] overflow-y-auto">
                {matchingOrders.map(order => {
                  const StatusIcon = statusIcons[order.order_status] || FaClock
                  return (
                    <li key={order.order_id}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDropdown(false)
                          navigate(`/my-orders/${order.order_id}`)
                        }}
                        className="w-full flex items-center justify-between gap-3 border-b border-soil-50 p-4 text-left hover:bg-soil-50 transition"
                      >
                        <div>
                          <p className="font-extrabold text-soil-900">#{order.order_id}</p>
                          <p className="text-xs font-medium text-soil-500 mt-0.5 truncate max-w-[200px]">
                            {order.items?.map(i => i.product_name).join(', ')}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-black text-[#2d6f35]">{money(order.total_amount)}</span>
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-soil-500">
                            <StatusIcon className="text-soil-400" />
                            {order.order_status}
                          </span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
