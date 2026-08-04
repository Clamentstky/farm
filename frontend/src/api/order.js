import apiClient from './client'

export async function placeOrder(orderData) {
  const { data } = await apiClient.post('/api/orders', orderData)
  return data
}

export async function getOrders() {
  const { data } = await apiClient.get('/api/orders')
  return data
}

export async function getOrder(orderId) {
  const { data } = await apiClient.get(`/api/orders/${orderId}`)
  return data
}

export async function deleteOrder(orderId) {
  const { data } = await apiClient.delete(`/api/orders/${orderId}`)
  return data
}

export async function cancelOrder(orderId) {
  const { data } = await apiClient.post(`/api/orders/${orderId}/cancel`)
  return data
}

export async function reorderItems(orderId) {
  const { data } = await apiClient.post(`/api/orders/${orderId}/reorder`)
  return data
}