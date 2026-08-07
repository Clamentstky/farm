import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEye, FaTruck, FaTimes, FaCheck, FaTimesCircle } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Preparing: 'bg-purple-100 text-purple-700 border-purple-200',
  'Out for Delivery': 'bg-orange-100 text-orange-700 border-orange-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showToast } = useToast()

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  const fetchData = async () => {
    try {
      const [ordRes, partRes] = await Promise.all([
        api.get(`/api/admin/orders?status=${filter}`),
        api.get('/api/admin/delivery/partners')
      ])
      setOrders(ordRes.data)
      setPartners(partRes.data)
    } catch (error) {
      showToast('Failed to fetch data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [filter])

  const openAssignModal = (order) => {
    setSelectedOrder(order)
    reset({ partner_id: order.delivery_assignment || '' })
    setIsModalOpen(true)
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { order_status: newStatus })
      showToast('Order status updated', 'success')
      fetchData()
    } catch (error) {
      showToast('Failed to update status', 'error')
    }
  }

  const onAssignSubmit = async (data) => {
    try {
      await api.post(`/api/admin/orders/${selectedOrder.order_id}/assign-delivery`, data)
      showToast('Delivery partner assigned', 'success')
      setIsModalOpen(false)
      fetchData()
    } catch (error) {
      showToast(error.response?.data?.detail || 'Assignment failed', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-soil-900">Orders</h1>
          <p className="hidden sm:block text-sm font-medium text-soil-500">Track and fulfill customer orders</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="shrink-0 rounded-xl border border-soil-200 bg-white px-2 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-soil-700 focus:border-[#055205] focus:outline-none"
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="rounded-3xl border border-soil-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-soil-50 text-soil-500">
              <tr>
                <th className="px-6 py-4 font-bold">Order Details</th>
                <th className="px-6 py-4 font-bold">Customer ID</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Delivery</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soil-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center font-bold text-soil-500">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center font-bold text-soil-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-soil-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-black text-soil-900">#{order.order_id}</p>
                      <p className="text-xs font-semibold text-soil-500">{new Date(order.created_at).toLocaleString()}</p>
                      <p className="mt-1 text-xs text-soil-600 max-w-[200px] truncate">
                        {order.items.map(i => `${i.quantity}x ${i.product_name}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-soil-600">{order.customer_id}</td>
                    <td className="px-6 py-4">
                      <p className="font-black text-[#2d6f35]">₹{order.total_amount.toFixed(2)}</p>
                      <p className="text-xs font-semibold text-soil-500">{order.payment_method} - {order.payment_status}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.order_status}
                        onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold focus:outline-none ${statusStyles[order.order_status]}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {order.delivery_assignment ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-[#055205]">
                          <FaCheck className="text-leaf-500" />
                          Partner #{order.delivery_assignment}
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-yellow-600">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openAssignModal(order)} title="Assign Delivery" className="rounded-lg bg-orange-50 p-2 text-orange-600 hover:bg-orange-100 transition-colors">
                          <FaTruck />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Delivery Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-soil-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-black text-soil-900">Assign Delivery</h2>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-soil-100 p-2 text-soil-500 hover:bg-soil-200 hover:text-soil-900">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit(onAssignSubmit)} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-bold text-soil-700">Select Partner</label>
                  <select
                    {...register('partner_id', { required: 'Please select a partner' })}
                    className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                  >
                    <option value="">-- Choose Partner --</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.village_coverage || 'Any'}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-soil-600 hover:bg-soil-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#055205] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#055205]/30 hover:bg-[#043d04] disabled:opacity-70"
                  >
                    {isSubmitting ? 'Assigning...' : 'Assign'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
