import apiClient from './client'

export const registerCustomer = (payload) =>
  apiClient.post('/api/auth/register', payload).then((res) => res.data)

export const loginWithPassword = (payload) =>
  apiClient.post('/api/auth/login/password', payload).then((res) => res.data)

export const requestOtp = (mobile_number) =>
  apiClient.post('/api/auth/otp/request', { mobile_number }).then((res) => res.data)

export const verifyOtp = (payload) =>
  apiClient.post('/api/auth/otp/verify', payload).then((res) => res.data)

export const forgotPassword = (mobile_number) =>
  apiClient.post('/api/auth/forgot-password', { mobile_number }).then((res) => res.data)

export const resetPassword = (payload) =>
  apiClient.post('/api/auth/reset-password', payload).then((res) => res.data)

export const getProfile = () =>
  apiClient.get('/api/auth/profile').then((res) => res.data)

export const updateProfile = (payload) =>
  apiClient.put('/api/auth/profile', payload).then((res) => res.data)

export const logoutApi = () =>
  apiClient.post('/api/auth/logout').then((res) => res.data)

