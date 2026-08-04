import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaRegTimesCircle } from 'react-icons/fa'

const CANCEL_REASONS = [
  'Ordered by mistake',
  'Found a better price elsewhere',
  'Delivery time is too long',
  'Changed my mind',
  'Others'
]

export default function CancelOrderModal({ isOpen, onClose, onConfirm, isCancelling }) {
  const [selectedReason, setSelectedReason] = useState('')
  const [otherReason, setOtherReason] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!selectedReason) return
    const finalReason = selectedReason === 'Others' ? otherReason : selectedReason
    onConfirm(finalReason)
  }

  const isConfirmDisabled = !selectedReason || (selectedReason === 'Others' && !otherReason.trim()) || isCancelling

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-soil-900/60 backdrop-blur-sm"
            onClick={!isCancelling ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-soil-100 bg-red-50 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-black text-red-600">
                <FaRegTimesCircle /> Cancel Order
              </h2>
              <button
                onClick={onClose}
                disabled={isCancelling}
                className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="mb-4 text-sm font-medium text-soil-600">
                Please tell us why you want to cancel this order.
              </p>

              <div className="space-y-3">
                {CANCEL_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                      selectedReason === reason
                        ? 'border-red-200 bg-red-50 text-red-900'
                        : 'border-soil-200 hover:bg-soil-50 text-soil-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-bold">{reason}</span>
                  </label>
                ))}

                <AnimatePresence>
                  {selectedReason === 'Others' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pt-2"
                    >
                      <textarea
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        placeholder="Please specify..."
                        className="w-full rounded-xl border border-soil-200 p-3 text-sm text-soil-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        rows="3"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isCancelling}
                  className="flex-1 rounded-xl bg-soil-100 px-4 py-3 text-sm font-bold text-soil-700 hover:bg-soil-200 transition-colors disabled:opacity-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:bg-red-400"
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
