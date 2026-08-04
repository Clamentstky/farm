import apiClient from '../api/client'

export const getOrders = async (params) => {
  const { data } = await apiClient.get('/api/orders', { params })
  return data
}

export const getOrder = async (orderId) => {
  const { data } = await apiClient.get(`/api/orders/${orderId}`)
  return data
}

export const getOrderTracking = async (orderId) => {
  const { data } = await apiClient.get(`/api/orders/${orderId}/tracking`)
  return data
}

export const cancelOrder = async (orderId) => {
  const { data } = await apiClient.post(`/api/orders/${orderId}/cancel`)
  return data
}

export const reorderItems = async (orderId) => {
  const { data } = await apiClient.post(`/api/orders/${orderId}/reorder`)
  return data
}

export const downloadInvoice = async (orderId) => {
  const { data } = await apiClient.get(`/api/orders/${orderId}/invoice`, {
    responseType: 'blob'
  })
  return data
}
