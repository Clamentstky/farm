import apiClient from './client'

export const getCartItems = () =>
  apiClient.get('/api/cart').then((res) => res.data)

export const addCartItem = (productId, quantity = 1) =>
  apiClient.post('/api/cart', { product_id: productId, quantity }).then((res) => res.data)

export const updateCartItem = (cartItemId, quantity) =>
  apiClient.put(`/api/cart/${cartItemId}`, { quantity }).then((res) => res.data)

export const removeCartItem = (cartItemId) =>
  apiClient.delete(`/api/cart/${cartItemId}`)
