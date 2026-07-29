import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import SiteFooter from '../components/SiteFooter'
import { useAuth } from '../context/AuthContext'
import { getOrders, deleteOrder } from '../api/order'
import { extractErrorMessage } from '../api/client'
import { BRAND_NAME, BRAND_TAGLINE, productImage } from '../data/brand'

const STATUS_CONFIG = {
  'Pending': { color: 'text-amber-500', dot: 'bg-amber-500' },
  'Confirmed': { color: 'text-blue-500', dot: 'bg-blue-500' },
  'Preparing': { color: 'text-purple-500', dot: 'bg-purple-500' },
  'Out for Delivery': { color: 'text-orange-500', dot: 'bg-orange-500' },
  'Delivered': { color: 'text-emerald-500', dot: 'bg-emerald-500' },
  'Cancelled': { color: 'text-red-500', dot: 'bg-red-500' },
}

const TRACKING_STEPS = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered']

function OrderTracker({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-bold tracking-wide">Order Cancelled</span>
      </div>
    )
  }

  const currentIndex = TRACKING_STEPS.indexOf(status)
  const activeIndex = currentIndex === -1 ? 0 : currentIndex

  return (
    <div className="w-full pb-2 md:pb-6 pt-2 mt-4">
      <div className="relative flex items-center justify-between px-2">
        {/* Background Track */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-soil-200 z-0"></div>
        
        {/* Active Track */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-leaf-500 z-0 transition-all duration-700 ease-in-out"
          style={{ width: `${(activeIndex / (TRACKING_STEPS.length - 1)) * 100}%` }}
        ></div>
        
        {TRACKING_STEPS.map((step, idx) => {
          const isActive = idx <= activeIndex
          const isCurrent = idx === activeIndex
          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div 
                className={`flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full transition-all duration-500 ${
                  isActive 
                    ? 'bg-leaf-500 text-white shadow-md' 
                    : 'bg-soil-200 text-transparent'
                }`}
              >
              </div>
              <span 
                className={`absolute top-6 hidden md:block whitespace-nowrap text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  isCurrent ? 'text-leaf-700' : isActive ? 'text-leaf-600' : 'text-soil-400'
                }`}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
      {/* Mobile Label */}
      <div className="mt-4 flex justify-center md:hidden">
        <span className="text-xs font-bold text-leaf-700 uppercase tracking-wider">
          {status}
        </span>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const { customer } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedOrder, setSelectedOrder] = useState(null)
  
  // Deletion state
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (!customer) return
    setLoading(true)
    setError('')
    getOrders()
      .then(setOrders)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [customer])

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // Handle Order Deletion
  const handleDeleteConfirm = async (orderToCancel) => {
    if (!orderToCancel) return
    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteOrder(orderToCancel.order_id || orderToCancel.id)
      setOrders((prev) => prev.filter((o) => o.id !== orderToCancel.id))
      setToastMessage(`Order ${orderToCancel.order_id} cancelled successfully!`)
      setSelectedOrder(null)
      setTimeout(() => setToastMessage(''), 3000)
    } catch (err) {
      setDeleteError(extractErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  if (selectedOrder) {
    // DETAILS VIEW
    return (
      <div className="min-h-screen bg-soil-50 text-soil-800 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-soil-200 bg-white shadow-sm">
          <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-3">
            <button 
              onClick={() => { setSelectedOrder(null); setDeleteError('') }}
              className="p-2 -ml-2 rounded-full hover:bg-soil-100 transition"
            >
              <svg className="h-6 w-6 text-soil-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="font-display text-lg font-bold text-soil-800">Order Details</h1>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-grow px-4 py-6 sm:px-6">
          <div className="bg-white rounded-md shadow-sm border border-soil-200 overflow-hidden">
            {/* Order Info Header */}
            <div className="border-b border-soil-100 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-soil-500">Order ID - {selectedOrder.order_id}</p>
                <p className="mt-1 text-sm font-bold text-soil-800">Placed on {formatDate(selectedOrder.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-soil-900">₹{Number(selectedOrder.total_amount).toFixed(2)}</p>
              </div>
            </div>

            {/* Tracker */}
            <div className="p-4 sm:p-6 border-b border-soil-100">
              <OrderTracker status={selectedOrder.order_status} />
            </div>

            {/* Items */}
            <div className="p-4 sm:p-6 border-b border-soil-100">
              <h3 className="text-base font-bold text-soil-800 mb-4">Products</h3>
              <div className="space-y-4">
                {selectedOrder.items && selectedOrder.items.map(item => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="h-16 w-16 flex-shrink-0 bg-soil-100 rounded flex items-center justify-center text-soil-400 font-bold text-xl overflow-hidden">
                      <img src={productImage(item)} alt={item.product_name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-soil-800">{item.product_name}</p>
                      <p className="text-sm text-soil-500 mt-1">{item.unit && `Unit: ${item.unit} | `}Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-soil-800">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Details */}
            <div className="p-4 sm:p-6">
              <h3 className="text-base font-bold text-soil-800 mb-4">Price Details</h3>
              <div className="space-y-2 text-sm text-soil-700">
                <div className="flex justify-between">
                  <span>List Price</span>
                  <span>₹{(Number(selectedOrder.total_amount) - Number(selectedOrder.delivery_charge)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{selectedOrder.delivery_charge > 0 ? `₹${Number(selectedOrder.delivery_charge).toFixed(2)}` : 'FREE'}</span>
                </div>
                <div className="flex justify-between font-bold text-soil-900 pt-2 border-t border-soil-100 mt-2">
                  <span>Total Amount</span>
                  <span>₹{Number(selectedOrder.total_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Payment Method</span>
                  <span className="font-semibold">{selectedOrder.payment_method}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Action */}
          {selectedOrder.order_status !== 'Delivered' && selectedOrder.order_status !== 'Cancelled' && (
            <div className="mt-6 flex flex-col items-center">
               {deleteError && (
                <div className="mb-4 w-full rounded bg-red-50 p-3 text-center text-sm font-semibold text-red-600 border border-red-100">
                  {deleteError}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to cancel this order?")) {
                    handleDeleteConfirm(selectedOrder)
                  }
                }}
                disabled={isDeleting}
                className="w-full sm:w-auto px-8 py-3 rounded text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          )}
        </main>
      </div>
    )
  }

  // LIST VIEW
  return (
    <div className="min-h-screen bg-soil-100 text-soil-800 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded bg-leaf-600 px-4 py-3 text-sm font-bold text-white shadow-lg animate-fade-in">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-soil-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/customer/dashboard" className="flex items-center gap-3">
            <BrandIcon className="h-8 w-8" />
            <h1 className="font-display text-lg font-bold text-soil-800">My Orders</h1>
          </Link>
          <Link
            to="/customer/dashboard"
            className="text-sm font-semibold text-leaf-600 hover:text-leaf-700"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-grow px-2 py-4 sm:px-6 sm:py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-leaf-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded bg-white p-12 text-center shadow-sm border border-soil-200 flex flex-col items-center">
            <div className="mb-4 text-leaf-500">
              <svg className="h-12 w-12 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-soil-800">No orders found</h3>
            <p className="mt-2 text-sm text-soil-500 mb-6">Looks like you haven't placed an order yet.</p>
            <Link to="/customer/dashboard" className="inline-flex items-center justify-center rounded-md bg-leaf-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-leaf-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.order_status] || { color: 'text-soil-500', dot: 'bg-soil-500' }
              const firstItem = order.items && order.items.length > 0 ? order.items[0] : null
              const extraCount = order.items ? order.items.length - 1 : 0

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white border border-soil-200 rounded sm:rounded-md shadow-sm hover:shadow transition cursor-pointer p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
                >
                  {/* Left: Product Info */}
                  <div className="flex gap-4 items-center sm:w-1/2">
                    <div className="h-16 w-16 bg-soil-100 rounded flex-shrink-0 flex items-center justify-center text-soil-400 font-bold text-2xl overflow-hidden">
                      {firstItem ? (
                        <img src={productImage(firstItem)} alt={firstItem.product_name} className="h-full w-full object-cover" />
                      ) : (
                        'O'
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-soil-800 text-sm sm:text-base line-clamp-1">
                        {firstItem ? firstItem.product_name : 'Order'}
                      </h4>
                      {extraCount > 0 && (
                        <p className="text-xs text-soil-500 mt-0.5">+{extraCount} more items</p>
                      )}
                      <p className="text-xs text-soil-500 mt-1">Order ID: {order.order_id}</p>
                    </div>
                  </div>

                  {/* Middle: Price */}
                  <div className="sm:w-32 sm:text-center mt-2 sm:mt-0">
                    <span className="font-bold text-soil-900">₹{Number(order.total_amount).toFixed(2)}</span>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="sm:w-48 sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center mt-2 sm:mt-0 gap-4">
                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${statusCfg.dot}`}></span>
                        <span className="font-semibold text-sm text-soil-800">{order.order_status}</span>
                      </div>
                      <p className="text-xs text-soil-500 mt-1">On {formatDate(order.created_at)}</p>
                    </div>

                    {/* Delete Button (Outside) */}
                    {order.order_status !== 'Delivered' && order.order_status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm("Are you sure you want to cancel this order?")) {
                            handleDeleteConfirm(order)
                          }
                        }}
                        disabled={isDeleting}
                        className="flex h-8 w-8 items-center justify-center rounded bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50 sm:ml-auto"
                        title="Cancel/Delete order"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      
      {!selectedOrder && <SiteFooter compact />}
    </div>
  )
}