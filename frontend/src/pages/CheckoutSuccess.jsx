import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import SiteFooter from '../components/SiteFooter'
import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'

export default function CheckoutSuccess() {
  const location = useLocation()
  const [copied, setCopied] = useState(false)

  const {
    orderId,
    orderDate,
    address,
    paymentMethod,
    orderStatus,
    totalAmount,
  } = location.state || {}

  if (!orderId) {
    return <Navigate to="/cart" replace />
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  const handleCopyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#eef7ed] text-soil-700">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/customer/dashboard" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <BrandIcon className="h-8 w-8 sm:h-10 sm:w-10 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-leaf-600 truncate">{BRAND_NAME}</p>
              <h1 className="font-display text-xs sm:text-lg font-bold text-soil-800 truncate">{BRAND_TAGLINE}</h1>
            </div>
          </Link>

          <Link
            to="/customer/dashboard"
            className="rounded-full border border-leaf-200 bg-leaf-50 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold text-leaf-700 transition hover:bg-leaf-100 shrink-0"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Success Banner Hero */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-leaf-600 to-emerald-500 text-white shadow-xl shadow-leaf-600/30 animate-bounce">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="mt-4 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
            Order Confirmed 🎉
          </span>

          <h2 className="mt-2 font-display text-3xl font-bold text-soil-800 sm:text-4xl">
            Order Placed Successfully!
          </h2>
          <p className="mt-2 max-w-md text-xs font-medium text-soil-500 sm:text-sm leading-relaxed">
            Thank you for shopping with FarmNest! We have received your order and are preparing it fresh for delivery.
          </p>
        </div>

        {/* Status Tracker Timeline */}
        <div className="mt-8 rounded-3xl border border-white/70 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-soil-400 text-center mb-4">
            Order Tracking Status
          </p>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-600 text-white text-xs font-bold shadow-sm">
                ✓
              </div>
              <span className="text-[11px] font-bold text-leaf-700">Order Placed</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold shadow-sm animate-pulse">
                📦
              </div>
              <span className="text-[11px] font-bold text-amber-700">Preparing</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 opacity-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soil-200 text-soil-600 text-xs font-bold">
                🚚
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-soil-500 leading-tight">Out for<br className="sm:hidden" /> Delivery</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 opacity-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-soil-200 text-soil-600 text-xs font-bold">
                🏡
              </div>
              <span className="text-[11px] font-medium text-soil-500">Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="mt-6 rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
          {/* Order ID & Copy Bar */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col border-b border-soil-100 pb-3 gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-soil-400 text-center w-full block">Order Reference</span>
              <div className="flex justify-between items-center">
                <span className="font-display font-bold text-soil-800 break-all pr-2">{orderId}</span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="rounded-lg bg-soil-100 px-3 py-1 text-[10px] font-bold text-soil-600 hover:bg-soil-200 shrink-0"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-soil-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-soil-400">Payment Method</span>
              <span className="font-bold text-soil-800">{paymentMethod}</span>
            </div>

            <div className="flex justify-between items-center border-b border-soil-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-soil-400">Status</span>
              <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                {orderStatus || 'Pending'}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-soil-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-soil-400">Total Paid</span>
              <span className="font-display text-base sm:text-lg font-bold text-leaf-700">
                ₹{totalAmount ? Number(totalAmount).toFixed(2) : '0.00'}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-soil-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-soil-400">Placed On</span>
              <span className="font-bold text-soil-700 text-xs">{formatDate(orderDate)}</span>
            </div>
          </div>

          {/* Delivery Address Details */}
          {address && (
            <div className="mt-5 rounded-2xl border border-[#f2ebe1] bg-[#fcfaf7] p-5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-pink-500 text-[10px]">📍</span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-soil-900">
                  Shipping To
                </p>
              </div>
              <p className="font-bold text-soil-900 text-sm">{address.full_name}</p>
              <p className="mt-1 text-sm text-soil-700">{address.address}, {address.village}</p>
              <p className="text-sm text-soil-700">{address.district}, {address.state} - {address.pincode}</p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="text-pink-500 text-xs">📞</span>
                <p className="text-sm font-bold text-soil-900">{address.mobile_number}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            to={`/my-orders/${orderId}`}
            className="w-full rounded-2xl bg-[#055205] py-3.5 text-center text-sm font-extrabold text-white shadow-lg shadow-[#055205]/20 transition hover:brightness-110 active:scale-98"
          >
            Track Order
          </Link>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/my-orders"
              className="flex-1 rounded-2xl border border-leaf-200 bg-leaf-50 py-3.5 text-center text-xs sm:text-sm font-bold text-leaf-700 shadow-sm transition hover:bg-leaf-100"
            >
              All Orders
            </Link>
            <Link
              to="/customer/dashboard"
              className="flex-1 rounded-2xl border border-soil-200 bg-white py-3.5 text-center text-xs sm:text-sm font-bold text-soil-700 shadow-sm transition hover:bg-soil-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter compact />
    </div>
  )
}