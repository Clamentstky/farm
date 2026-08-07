import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'
import { jwtDecode } from 'jwt-decode'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('admin_token')
      if (token) {
        try {
          const decoded = jwtDecode(token)
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('admin_token')
            localStorage.removeItem('admin_user')
            setAdmin(null)
          } else {
            const userData = JSON.parse(localStorage.getItem('admin_user'))
            setAdmin(userData)
          }
        } catch (error) {
          console.error("Invalid admin token", error)
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/api/admin/auth/login', { email, password })
    const { access_token, admin: adminData } = res.data
    
    localStorage.setItem('admin_token', access_token)
    localStorage.setItem('admin_user', JSON.stringify(adminData))
    setAdmin(adminData)
    return adminData
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)
