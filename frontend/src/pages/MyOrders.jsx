import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getOrders } from '../services/orderService'

import OrderHeader from '../components/orders/OrderHeader'
import OrderStats from '../components/orders/OrderStats'
import OrderSearchBar from '../components/orders/OrderSearchBar'
import OrderCard from '../components/orders/OrderCard'
import { OrderCardSkeleton } from '../components/orders/OrderSkeleton'
import SiteFooter from '../components/SiteFooter'
import { Link } from 'react-router-dom'
import OrdersTopBar from '../components/orders/OrdersTopBar'

export default function MyOrders() {
  const { customer } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: 'All', sort: 'newest' })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await getOrders({ page: 1, limit: 100 })
        setOrders(data.items || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(o => {
    const query = filters.search.trim().toLowerCase()
    const searchMatch = !query ||
      (o.order_id?.toString().toLowerCase() || '').includes(query) ||
      o.items?.some(i => (i.product_name || '').toLowerCase().includes(query))
    const statusMatch =
      filters.status === 'All' ||
      (filters.status === 'In Progress' && !['Delivered', 'Cancelled'].includes(o.order_status)) ||
      o.order_status === filters.status
    return searchMatch && statusMatch
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (filters.sort === 'newest') return new Date(b.created_at) - new Date(a.created_at)
    if (filters.sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
    if (filters.sort === 'highest') return b.total_amount - a.total_amount
    if (filters.sort === 'lowest') return a.total_amount - b.total_amount
    return 0
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col bg-[#eef7ed]">
      <OrdersTopBar />
      <main className="flex-grow mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 md:py-10">
        
        <div className="mb-5 w-full">
          <OrderHeader customer={customer}>
            {!loading && <OrderStats orders={orders} />}
          </OrderHeader>
        </div>

        {!loading && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative z-40"
          >
            <OrderSearchBar filters={filters} setFilters={setFilters} orders={orders} />
          </motion.div>
        )}

        <div className="space-y-6 relative min-h-[400px]">
          {loading ? (
            Array(3).fill(0).map((_, i) => <OrderCardSkeleton key={i} />)
          ) : sortedOrders.length > 0 ? (
            <AnimatePresence>
              {sortedOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <OrderCard order={order} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-soil-100 shadow-sm text-center">
              <div className="w-48 h-48 bg-leaf-50 rounded-full flex items-center justify-center mb-6 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-leaf-100"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
                <img src="/favicon.svg" alt="Empty" className="w-24 h-24 opacity-30 grayscale relative z-10" />
              </div>
              <h3 className="text-3xl font-black text-soil-900 mb-3 tracking-tight">No Orders Found</h3>
              <p className="text-soil-500 mb-8 max-w-sm text-lg">Looks like you haven't placed any orders matching these filters yet.</p>
              <Link to="/customer/dashboard" className="px-8 py-4 bg-gradient-to-r from-leaf-600 to-leaf-500 text-white font-bold rounded-2xl shadow-lg shadow-leaf-500/30 hover:shadow-xl hover:-translate-y-1 transition-all">Start Shopping</Link>
            </motion.div>
          )}
        </div>

      </main>
      <SiteFooter />
    </motion.div>
  )
}
