import React from 'react'
import { FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa'

export default function OrderFilters({ filters, setFilters }) {
  
  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }))
  }

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sort: e.target.value }))
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-soil-100 flex flex-col md:flex-row items-center gap-4 mb-8">
      
      {/* Search Bar */}
      <div className="relative flex-grow w-full md:w-auto">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-400" />
        <input 
          type="text" 
          placeholder="Search by Order ID or Product Name..."
          className="w-full pl-10 pr-4 py-3 bg-soil-50 border border-soil-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-shadow"
        />
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        
        <div className="relative min-w-[140px]">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-400 text-xs" />
          <select 
            value={filters?.status || 'All'}
            onChange={handleStatusChange}
            className="w-full pl-8 pr-4 py-3 bg-soil-50 border border-soil-200 rounded-xl text-sm font-medium text-soil-700 appearance-none focus:outline-none focus:ring-2 focus:ring-leaf-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="relative min-w-[160px]">
          <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-400 text-xs" />
          <select 
            value={filters?.sort || 'newest'}
            onChange={handleSortChange}
            className="w-full pl-8 pr-4 py-3 bg-soil-50 border border-soil-200 rounded-xl text-sm font-medium text-soil-700 appearance-none focus:outline-none focus:ring-2 focus:ring-leaf-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>

      </div>
    </div>
  )
}
