import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import PrimaryButton from '../components/PrimaryButton'
import SiteFooter from '../components/SiteFooter'
import { useAuth } from '../context/AuthContext'
import { getOrders, deleteOrder } from '../api/order'
import { extractErrorMessage } from '../api/client'
import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'

const STATUS_CONFIG = {
  'All': { bg: 'bg-soil-100 text-soil-700 border-soil-200' },
  'Pending': { bg: 'bg-amber-100/80 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  'Confirmed': { bg: 'bg-blue-100/80 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
  'Preparing': { bg: 'bg-purple-100/80 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
  'Out for Delivery': { bg: 'bg-orange-100/80 text-orange-800 border-orange-200', dot: 'bg-orange-500' },
  'Delivered': { bg: 'bg-emerald-100/80 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  'Cancelled': { bg: 'bg-red-100/80 text-red-800 border-red-200', dot: 'bg-red-500' },
}

export default function OrdersPage() {
  const { customer } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')

  // Deletion state
  const [orderToDelete, setOrderToDelete] = useState(null)
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

  // Analytics Stats
  const stats = useMemo(() => {
    const total = orders.length
    const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
    const pending = orders.filter((o) => o.order_status === 'Pending' || o.order_status === 'Preparing').length
    const delivered = orders.filter((o) => o.order_status === 'Delivered').length
    return { total, totalSpent, pending, delivered }
  }, [orders])

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = selectedStatus === 'All' || order.order_status === selectedStatus
      const matchesSearch =
        searchQuery.trim() === '' ||
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items?.some((item) =>
          item.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      return matchesStatus && matchesSearch
    })
  }, [orders, selectedStatus, searchQuery])

  // Handle Order Deletion
  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return
    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteOrder(orderToDelete.order_id || orderToDelete.id)
      setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id))
      setToastMessage(`Order ${orderToDelete.order_id} deleted successfully!`)
      setOrderToDelete(null)
      setTimeout(() => setToastMessage(''), 3000)
    } catch (err) {
      setDeleteError(extractErrorMessage(err))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-soil-50 text-soil-700">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl bg-leaf-700 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-fade-in">
          <svg className="h-5 w-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-soil-100 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/customer/dashboard" className="flex items-center gap-3">
            <BrandIcon className="h-10 w-10" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">{BRAND_NAME}</p>
              <h1 className="font-display text-lg font-semibold text-soil-700">{BRAND_TAGLINE}</h1>
            </div>
          </Link>
          <Link
            to="/customer/dashboard"
            className="rounded-full border border-leaf-500/30 bg-leaf-600/10 px-4 py-2 text-sm font-bold text-leaf-700 transition hover:bg-leaf-600/20"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Title & Stats Section */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-soil-700 sm:text-3xl">My Orders</h2>
              <p className="mt-1 text-sm text-soil-500">Track, manage, or delete your farm product orders.</p>
            </div>
          </div>

          {/* Stats Bar */}
          {!loading && orders.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-2xl border border-soil-100 bg-white p-3.5 shadow-sm sm:p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-soil-400">Total Orders</p>
                <p className="mt-1 font-display text-2xl font-bold text-soil-700">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-soil-100 bg-white p-3.5 shadow-sm sm:p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-soil-400">Pending</p>
                <p className="mt-1 font-display text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="rounded-2xl border border-soil-100 bg-white p-3.5 shadow-sm sm:p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-soil-400">Delivered</p>
                <p className="mt-1 font-display text-2xl font-bold text-emerald-600">{stats.delivered}</p>
              </div>
              <div className="rounded-2xl border border-soil-100 bg-white p-3.5 shadow-sm sm:p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-soil-400">Total Spent</p>
                <p className="mt-1 font-display text-2xl font-bold text-leaf-700">
                  ₹{stats.totalSpent.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs & Search Bar */}
        {!loading && orders.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-soil-100/70 p-1">
              {['All', 'Pending', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    selectedStatus === status
                      ? 'bg-white text-leaf-700 shadow-sm'
                      : 'text-soil-600 hover:text-soil-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search order ID or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-soil-200 bg-white py-2 pl-9 pr-3 text-xs font-medium text-soil-700 placeholder-soil-400 focus:border-leaf-500 focus:outline-none focus:ring-1 focus:ring-leaf-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-soil-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Orders Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-leaf-500 border-t-transparent" />
            <p className="mt-3 text-xs font-bold text-soil-400">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-soil-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold text-soil-700">No orders yet</h3>
            <p className="mt-2 text-sm text-soil-500">Your order history will appear here once you place your first order.</p>
            <Link to="/customer/dashboard" className="mt-6 inline-block">
              <PrimaryButton>Start Shopping</PrimaryButton>
            </Link>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-soil-200 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-soil-500">No orders match your filter criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('All')
                setSearchQuery('')
              }}
              className="mt-2 text-xs font-bold text-leaf-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.order_status] || {
                bg: 'bg-soil-100 text-soil-600 border-soil-200',
              }

              return (
                <div
                  key={order.id}
                  className="group relative overflow-hidden rounded-3xl border border-soil-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  {/* Absolute Delete Button in Top-Right Corner */}
                  <button
                    type="button"
                    onClick={() => setOrderToDelete(order)}
                    className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 rounded-xl border border-red-100 bg-red-50/90 px-2.5 py-1 text-xs font-bold text-red-600 shadow-2xs transition hover:border-red-200 hover:bg-red-100 active:scale-95 sm:top-5 sm:right-6 sm:px-3 sm:py-1.5"
                    title="Delete order"
                  >
                    <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>

                  {/* Top Bar: Order ID, Status, Date */}
                  <div className="border-b border-soil-100 pb-3 pr-24 sm:pr-28">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-display text-lg font-bold text-soil-800 sm:text-xl">
                        {order.order_id}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${statusCfg.bg}`}
                      >
                        {statusCfg.dot && <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />}
                        {order.order_status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs font-semibold text-soil-400">
                      {formatDate(order.created_at)}
                    </p>
                  </div>


                  {/* Summary Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4 sm:gap-4 sm:text-sm">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-soil-400 sm:text-xs">
                        Products
                      </p>
                      <p className="mt-0.5 font-bold text-soil-700">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-soil-400 sm:text-xs">
                        Payment Method
                      </p>
                      <p className="mt-0.5 font-bold text-soil-700">{order.payment_method}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-soil-400 sm:text-xs">
                        Delivery Charge
                      </p>
                      <p className="mt-0.5 font-bold text-soil-700">
                        {order.delivery_charge > 0 ? `₹${Number(order.delivery_charge).toFixed(2)}` : 'FREE'}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-soil-400 sm:text-xs">
                        Total Amount
                      </p>
                      <p className="mt-0.5 font-display text-base font-bold text-leaf-700 sm:text-lg">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Items Details */}
                  {order.items && order.items.length > 0 && (
                    <details className="mt-4 group/details">
                      <summary className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-leaf-600 hover:text-leaf-700">
                        <span>View Order Details</span>
                        <svg
                          className="h-3.5 w-3.5 transition-transform group-open/details:rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-3 space-y-2 rounded-2xl border border-soil-100 bg-soil-50/60 p-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-xs text-soil-700 sm:text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-leaf-100 text-[10px] font-bold text-leaf-700">
                                {item.quantity}×
                              </span>
                              <span className="font-semibold">{item.product_name}</span>
                              {item.unit && (
                                <span className="text-[11px] text-soil-400">({item.unit})</span>
                              )}
                            </div>
                            <span className="font-bold text-soil-800">
                              ₹{(Number(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-scale-up">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <h3 className="font-display text-lg font-bold text-soil-800">
              Delete Order {orderToDelete.order_id}?
            </h3>
            <p className="mt-2 text-xs text-soil-500 leading-relaxed">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-3 rounded-xl bg-red-50 p-2.5 text-xs font-semibold text-red-600">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setOrderToDelete(null)
                  setDeleteError('')
                }}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-soil-200 bg-white py-2.5 text-xs font-bold text-soil-700 transition hover:bg-soil-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter compact />
    </div>
  )
}