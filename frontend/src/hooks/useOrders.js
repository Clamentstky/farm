import { useState, useEffect, useCallback } from 'react'
import { getOrders } from '../services/orderService'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Filters state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('newest')

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const params = {
        page,
        limit,
        search: search || undefined,
        order_status: status === 'All' ? undefined : status,
        sort
      }
      const data = await getOrders(params)
      setOrders(data.items)
      setTotal(data.total)
      setTotalPages(data.pages)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch orders.')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, status, sort])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    loading,
    error,
    total,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    status,
    setStatus,
    sort,
    setSort,
    refreshOrders: fetchOrders
  }
}
