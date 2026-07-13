import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getProfile, logoutApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem('customer')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }
    // Validate token / refresh profile on app load
    getProfile()
      .then((profile) => {
        setCustomer(profile)
        localStorage.setItem('customer', JSON.stringify(profile))
      })
      .catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('customer')
        setCustomer(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback((token, customerData) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('customer', JSON.stringify(customerData))
    setCustomer(customerData)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      // ignore network errors on logout; clear local state regardless
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('customer')
    setCustomer(null)
  }, [])

  return (
    <AuthContext.Provider value={{ customer, login, logout, loading, isAuthenticated: !!customer }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
