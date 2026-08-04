import React from 'react'
import { motion } from 'framer-motion'
import { FaBoxOpen, FaClock, FaCheckCircle, FaWallet } from 'react-icons/fa'

export default function OrderAnalytics({ orders }) {
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.order_status === 'Pending').length
  const deliveredOrders = orders.filter(o => o.order_status === 'Delivered').length
  const totalSpent = orders
    .filter(o => o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)

  const cards = [
    { title: 'Total Orders', value: totalOrders, icon: FaBoxOpen, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50' },
    { title: 'In Progress', value: pendingOrders, icon: FaClock, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
    { title: 'Delivered', value: deliveredOrders, icon: FaCheckCircle, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
    { title: 'Amount Spent', value: `₹${totalSpent.toFixed(0)}`, icon: FaWallet, color: 'from-purple-500 to-fuchsia-600', bg: 'bg-purple-50' }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={container} initial="hidden" animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {cards.map((card, idx) => (
        <motion.div 
          key={idx} variants={item}
          className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm border border-soil-100 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className="text-xl text-soil-800 opacity-80" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-soil-500 mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-soil-900">{card.value}</p>
          </div>
          <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${card.color} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500`} />
        </motion.div>
      ))}
    </motion.div>
  )
}
