import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronRight, FaFileInvoice, FaSyncAlt, FaRegTimesCircle } from 'react-icons/fa'
import { cancelOrder, reorderItems } from '../../services/orderService'
import { useToast } from '../../context/ToastContext'
import InvoicePreviewModal from './InvoicePreviewModal'
import CancelOrderModal from './CancelOrderModal'

export default function OrderActionBar({ order, detail = false }) {
  const { showToast } = useToast()
  const [isCancelling, setIsCancelling] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  const apiOrderId = order.order_id || order.id

  const handleCancelConfirm = async (reason) => {
    try {
      setIsCancelling(true)
      await cancelOrder(apiOrderId) // If backend later supports reason, we can pass it here
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
      await reorderItems(apiOrderId)
      showToast('Items added to cart!')
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to reorder')
    } finally {
      setIsReordering(false)
    }
  }

  const isPending = order.order_status === 'Pending'
  const isDelivered = order.order_status === 'Delivered'
  const buttonCount = 1 + (isPending ? 1 : 0) + (isDelivered ? 1 : 0)

  return (
    <div className={detail ? 'flex w-full' : 'flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-soil-100 pt-5 w-full'}>
      <div className={
        detail 
          ? 'flex flex-col sm:flex-row gap-3 w-full sm:w-auto' 
          : `grid ${buttonCount === 2 ? 'grid-cols-2' : 'grid-cols-1'} sm:flex sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto`
      }>
        <button
          type="button"
          onClick={() => setIsInvoiceOpen(true)}
          className="inline-flex w-full sm:w-auto h-11 items-center justify-center gap-1 sm:gap-2 rounded-xl border border-soil-200 bg-white px-2 sm:px-4 text-xs sm:text-sm font-extrabold text-soil-700 shadow-sm transition hover:bg-soil-50"
        >
          <FaFileInvoice className="text-sm sm:text-base text-soil-500" />
          <span className="truncate">{detail ? 'View Invoice' : 'Invoice'}</span>
        </button>

        {isPending && (
          <button
            type="button"
            onClick={() => setIsCancelModalOpen(true)}
            disabled={isCancelling}
            className="inline-flex w-full sm:w-auto h-11 items-center justify-center gap-1 sm:gap-2 rounded-xl border border-red-100 bg-red-50 px-2 sm:px-4 text-xs sm:text-sm font-extrabold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
          >
            <FaRegTimesCircle className={isCancelling ? 'animate-spin text-sm sm:text-base' : 'text-sm sm:text-base'} />
            <span className="truncate">{detail ? 'Cancel Order' : 'Cancel'}</span>
          </button>
        )}

        {order.order_status === 'Delivered' && (
          <button
            type="button"
            onClick={handleReorder}
            disabled={isReordering}
            className="inline-flex w-full sm:w-auto h-11 items-center justify-center gap-1 sm:gap-2 rounded-xl border border-leaf-200 bg-white px-2 sm:px-4 text-xs sm:text-sm font-extrabold text-leaf-700 shadow-sm transition hover:bg-leaf-50 disabled:opacity-60"
          >
            <FaSyncAlt className={isReordering ? 'animate-spin text-sm sm:text-base' : 'text-sm sm:text-base'} />
            <span className="truncate">{detail ? 'Reorder' : 'Reorder'}</span>
          </button>
        )}
      </div>

      {!detail && (
        <Link
          to={`/my-orders/${order.order_id || order.id}`}
          className="inline-flex w-full sm:w-auto h-11 items-center justify-center gap-2 rounded-xl bg-[#055205] px-5 text-sm font-extrabold text-white shadow-lg shadow-[#055205]/20 transition hover:brightness-110 shrink-0"
        >
          Details & Track
          <FaChevronRight className="text-xs" />
        </Link>
      )}

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
