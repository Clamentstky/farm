import { useState, useEffect, useCallback } from 'react'
import { getOrder, getOrderTracking } from '../services/orderService'

export function useOrderDetails(orderId) {
  const [order, setOrder] = useState(null)
  const [tracking, setTracking] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDetails = useCallback(async () => {
    if (!orderId) return
    try {
      setLoading(true)
      setError('')
      const [orderData, trackingData] = await Promise.all([
        getOrder(orderId),
        getOrderTracking(orderId)
      ])
      setOrder(orderData)
      setTracking(trackingData)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch order details.')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    fetchDetails()
  }, [fetchDetails])

  return {
    order,
    tracking,
    loading,
    error,
    refreshDetails: fetchDetails
  }
}
