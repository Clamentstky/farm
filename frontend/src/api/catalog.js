import apiClient from './client'

export const getCategories = () =>
  apiClient.get('/api/categories').then((res) => res.data)

export const getProducts = (search = '') =>
  apiClient
    .get('/api/products', { params: search ? { search } : {} })
    .then((res) => res.data)

export const getProductsByCategory = (categoryId) =>
  apiClient.get(`/api/categories/${categoryId}/products`).then((res) => res.data)

export const getProductDetails = (productId) =>
  apiClient.get(`/api/products/${productId}`).then((res) => res.data)

export const getRelatedProducts = (productId) =>
  apiClient.get(`/api/products/${productId}/related`).then((res) => res.data)

export const getSimilarProducts = (productId) =>
  apiClient.get(`/api/products/${productId}/similar`).then((res) => res.data)

export const getFeaturedProducts = () =>
  apiClient.get('/api/products/featured').then((res) => res.data)

export const getPopularProducts = () =>
  apiClient.get('/api/products/popular').then((res) => res.data)
