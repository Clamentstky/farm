import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaFileInvoice, FaRegTimesCircle, FaSyncAlt, FaHeadset, FaCommentDots } from 'react-icons/fa'
import { cancelOrder, reorderItems } from '../../services/orderService'
import { useToast } from '../../context/ToastContext'
import InvoicePreviewModal from './InvoicePreviewModal'
import CancelOrderModal from './CancelOrderModal'

export default function StickyActionPanel({ order }) {
  const { showToast } = useToast()
  const [isCancelling, setIsCancelling] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  const handleCancelConfirm = async (reason) => {
    try {
      setIsCancelling(true)
      await cancelOrder(order.id)
      showToast('Order cancelled successfully!')
      setIsCancelModalOpen(false)
      window.location.reload()
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to cancel order')
      setIsCancelling(false)
    }
  }

  const handleReorder = async () => {
    try {
      setIsReordering(true)
      await reorderItems(order.id)
      showToast('Items added to cart!')
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to reorder')
    } finally {
      setIsReordering(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-sm border border-soil-100 sticky top-24 z-30 flex flex-col gap-3">
      
      <motion.button 
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => setIsInvoiceOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-leaf-800 text-white rounded-2xl text-sm font-bold shadow-lg shadow-leaf-800/20 hover:bg-leaf-900 transition-colors"
      >
        <FaFileInvoice />
        View Invoice
      </motion.button>

      {order.order_status === 'Pending' && (
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setIsCancelModalOpen(true)} disabled={isCancelling}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm font-bold shadow-sm hover:bg-red-100 transition-colors"
        >
          {isCancelling ? <span className="animate-spin text-lg">↻</span> : <FaRegTimesCircle />}
          Cancel Order
        </motion.button>
      )}

      {order.order_status === 'Delivered' && (
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleReorder} disabled={isReordering}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-leaf-700 border border-leaf-200 rounded-2xl text-sm font-bold shadow-sm hover:bg-leaf-50 transition-colors"
        >
          {isReordering ? <span className="animate-spin text-lg">↻</span> : <FaSyncAlt />}
          Reorder All Items
        </motion.button>
      )}

      <div className="border-t border-soil-100 my-2 pt-4 px-2">
        <p className="text-[10px] font-bold text-soil-400 tracking-wider uppercase mb-3">Need Help?</p>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 text-sm font-bold text-soil-700 hover:text-leaf-600 transition-colors">
            <div className="w-8 h-8 rounded-full bg-soil-100 flex items-center justify-center text-soil-500"><FaHeadset /></div>
            Call Support
          </button>
          <button className="flex items-center gap-3 text-sm font-bold text-soil-700 hover:text-leaf-600 transition-colors">
            <div className="w-8 h-8 rounded-full bg-soil-100 flex items-center justify-center text-soil-500"><FaCommentDots /></div>
            Chat with us
          </button>
        </div>
      </div>

      <InvoicePreviewModal 
        order={order} 
        isOpen={isInvoiceOpen} 
        onClose={() => setIsInvoiceOpen(false)} 
      />

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        isCancelling={isCancelling}
      />
    </div>
  )
}
