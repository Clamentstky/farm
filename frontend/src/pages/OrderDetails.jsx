import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { getOrder } from '../services/orderService'

import OrderInfoCard from '../components/orders/OrderInfoCard'
import OrderTimeline from '../components/orders/OrderTimeline'
import OrderItems from '../components/orders/OrderItems'
import DeliveryCard from '../components/orders/DeliveryCard'
import PaymentSummary from '../components/orders/PaymentSummary'
import SiteFooter from '../components/SiteFooter'
import OrdersTopBar from '../components/orders/OrdersTopBar'

export default function OrderDetails() {
  const { orderId } = useParams()
  const { customer } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const data = await getOrder(orderId)
        setOrder(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef7ed] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-leaf-200 border-t-leaf-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#eef7ed] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-black text-soil-900 mb-4">Order Not Found</h2>
        <Link to="/my-orders" className="px-6 py-3 bg-leaf-600 text-white font-bold rounded-xl hover:bg-leaf-700 transition-colors">Go Back to Orders</Link>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col bg-[#eef7ed]">
      <OrdersTopBar />
      <main className="flex-grow mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 md:py-10">
        
        <Link to="/my-orders" className="mb-5 inline-flex items-center gap-2 rounded-xl border border-soil-100 bg-white px-4 py-2.5 text-sm font-extrabold text-soil-700 shadow-sm transition hover:bg-soil-50">
          <FaArrowLeft /> Back to My Orders
        </Link>

        <div className="space-y-6">
          <OrderInfoCard order={order} />
          <OrderTimeline order={order} />
          <OrderItems order={order} />
          <div className="grid gap-6 lg:grid-cols-2">
            <DeliveryCard customer={customer} order={order} />
            <PaymentSummary order={order} />
          </div>
        </div>

      </main>
      <SiteFooter />
    </motion.div>
  )
}
