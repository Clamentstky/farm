import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminRoute() {
  const { admin, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7f4]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-soil-200 border-t-[#055205]"></div>
          <p className="text-sm font-bold text-soil-500">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
