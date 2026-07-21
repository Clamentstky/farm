import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token to every outgoing request if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401s globally by logging the customer out
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('customer')
      const publicAuthPages = ['/login', '/register', '/forgot-password']
      if (!publicAuthPages.includes(window.location.pathname)) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient

// Extracts a readable error message from FastAPI's error response shapes
export function extractErrorMessage(error) {
  if (error?.message && !error?.response) return error.message
  const data = error?.response?.data
  if (!data) return 'Something went wrong. Please try again.'
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.message).join(', ')
  }
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    return data.detail.map((e) => e.msg).join(', ')
  }
  return 'Something went wrong. Please try again.'
}
