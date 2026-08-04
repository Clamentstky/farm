import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaDownload, FaTimes, FaPrint } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import BrandIcon from '../BrandIcon'
import { BRAND_FULL_NAME } from '../../data/brand'

export default function InvoicePreviewModal({ order, isOpen, onClose }) {
  const { showToast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  if (!order) return null

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const token = localStorage.getItem('access_token')
      const apiOrderId = order.order_id || order.id
      const response = await fetch(`http://localhost:8000/api/orders/${apiOrderId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to generate invoice')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice_${order.order_id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      showToast('Invoice downloaded successfully!')
    } catch {
      showToast('Failed to download invoice')
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const subtotal = order.items?.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0) || 0
  const deliveryCharge = 0 // Globally 0 as per earlier rule
  const total = subtotal + deliveryCharge

  const address = order.address
  const name = address?.full_name || order.customer?.full_name || order.customer?.name || 'Customer'
  const phone = address?.mobile_number || order.customer?.phone
  const email = order.customer?.email

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:p-0 print:block print:bg-white">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-soil-900/60 backdrop-blur-sm print:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative z-10 flex w-full max-w-4xl flex-col max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden print:shadow-none print:h-auto print:max-h-none print:w-full print:max-w-none print:rounded-none"
          >
            {/* Action Header - Hidden when printing */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-soil-100 bg-soil-50 p-4 sm:px-6 sm:py-4 gap-4 print:hidden">
              <h2 className="text-lg font-black text-soil-900 w-full sm:w-auto text-center sm:text-left flex items-center justify-between">
                Invoice Preview
                <button
                  onClick={onClose}
                  className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full text-soil-500 hover:bg-soil-200 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePrint}
                  className="flex h-10 flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-soil-700 shadow-sm ring-1 ring-soil-200 transition hover:bg-soil-100 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                >
                  <FaPrint /> Print
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex h-10 flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-leaf-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-leaf-700 disabled:opacity-70 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                >
                  <FaDownload className={isDownloading ? 'animate-spin' : ''} />
                  <span className="truncate">{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="hidden sm:flex ml-2 h-10 w-10 items-center justify-center rounded-full text-soil-500 hover:bg-soil-200 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* A4 Invoice Document Area */}
            <div className="overflow-y-auto bg-soil-100 p-4 sm:p-8 print:p-0 print:bg-white print:overflow-visible">
              <div className="mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white p-8 sm:p-12 shadow-md print:shadow-none print:m-0 print:p-0">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-6 border-b-2 border-soil-900 pb-8">
                  <div className="flex items-center gap-3">
                    <BrandIcon className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 text-leaf-600" />
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-soil-900 uppercase tracking-widest">{BRAND_FULL_NAME}</h1>
                      <p className="text-xs sm:text-sm font-semibold text-soil-500">Village Farm Delivery</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <h2 className="text-3xl sm:text-4xl font-black text-soil-200 uppercase tracking-widest">INVOICE</h2>
                    <p className="mt-2 text-sm font-bold text-soil-800">#{order.order_id}</p>
                    <p className="text-sm font-medium text-soil-500">Date: {formatDate(order.created_at)}</p>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-2">Billed To:</h3>
                    <p className="text-base font-bold text-soil-900">{name}</p>
                    {email && <p className="text-sm text-soil-600 mt-1">{email}</p>}
                    {phone && <p className="text-sm text-soil-600">{phone}</p>}
                  </div>
                  <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-soil-400 mb-2">Shipping Address:</h3>
                    {address ? (
                      <div className="text-sm text-soil-600 space-y-1">
                        <p className="font-bold text-soil-900">{address.address_type || 'Address'}</p>
                        <p>{address.address}</p>
                        <p>{[address.village, address.district].filter(Boolean).join(', ')}</p>
                        <p>{[address.state, address.pincode].filter(Boolean).join(' - ')}</p>
                        {address.landmark && <p>Landmark: {address.landmark}</p>}
                      </div>
                    ) : (
                      <p className="text-sm text-soil-600">N/A</p>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="mt-12">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-soil-200 text-xs font-bold uppercase tracking-wider text-soil-500">
                        <th className="py-3 px-2">Item Description</th>
                        <th className="py-3 px-2 text-center">Qty</th>
                        <th className="py-3 px-2 text-right">Price</th>
                        <th className="py-3 px-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item.id || item.product_id} className="border-b border-soil-100">
                          <td className="py-4 px-2">
                            <p className="text-sm font-bold text-soil-900">{item.product_name || 'Product'}</p>
                            {item.unit && <p className="text-xs text-soil-500">{item.unit}</p>}
                          </td>
                          <td className="py-4 px-2 text-center text-sm font-medium text-soil-700">{item.quantity}</td>
                          <td className="py-4 px-2 text-right text-sm font-medium text-soil-700">₹{Number(item.price || 0).toFixed(2)}</td>
                          <td className="py-4 px-2 text-right text-sm font-bold text-soil-900">₹{(Number(item.quantity) * Number(item.price || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-8 flex justify-end">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm font-medium text-soil-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-soil-600">
                      <span>Delivery Charge</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between border-t-2 border-soil-900 pt-3 text-lg font-black text-soil-900">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-16 border-t border-soil-100 pt-8">
                  <p className="text-center text-sm font-medium text-soil-500">
                    Thank you for choosing FarmNest. If you have any questions about this invoice, please contact support.
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
