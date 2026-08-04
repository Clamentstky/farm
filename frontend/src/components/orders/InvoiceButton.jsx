import React, { useState } from 'react'
import { FaDownload, FaSpinner } from 'react-icons/fa'
import { downloadInvoice } from '../../services/orderService'

export default function InvoiceButton({ orderId, showToast }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const blob = await downloadInvoice(orderId)
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Invoice_${orderId}.pdf`
      
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      window.URL.revokeObjectURL(url)
      
      showToast('Invoice downloaded successfully!')
    } catch (err) {
      console.error(err)
      showToast('Failed to download invoice. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-leaf-600 bg-white border-2 border-leaf-600 hover:bg-leaf-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isDownloading ? (
        <>
          <FaSpinner className="animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <FaDownload />
          <span>Download Invoice</span>
        </>
      )}
    </button>
  )
}
