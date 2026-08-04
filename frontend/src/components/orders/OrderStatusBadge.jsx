import React from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaClock, FaBoxOpen, FaTruck, FaTimesCircle, FaClipboardCheck } from 'react-icons/fa'

const STATUS_STYLES = {
  'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: FaClock },
  'Confirmed': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: FaClipboardCheck },
  'Preparing': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: FaBoxOpen },
  'Out for Delivery': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: FaTruck },
  'Delivered': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: FaCheckCircle },
  'Cancelled': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: FaTimesCircle },
}

export default function OrderStatusBadge({ status, className = '' }) {
  const config = STATUS_STYLES[status] || STATUS_STYLES['Pending']
  const Icon = config.icon

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <Icon className="text-[10px]" />
      <span>Status : {status}</span>
    </motion.div>
  )
}
