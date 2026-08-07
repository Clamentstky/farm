import React, { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useToast } from '../../context/ToastContext'

export default function AdminLogin() {
  const { admin, login } = useAdminAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: 'admin@farmnest.com',
      password: 'admin'
    }
  })

  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [admin, navigate])

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password)
      showToast('Admin logged in successfully', 'success')
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      showToast(err.response?.data?.detail || 'Invalid credentials', 'error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7f4] p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="bg-[#055205] p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
            🌾
          </div>
          <h1 className="text-2xl font-black tracking-tight">FarmNest Admin</h1>
          <p className="mt-2 text-sm font-bold text-white/80 uppercase tracking-widest">
            Secure Access Portal
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-soil-700">Email Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-soil-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full rounded-xl border border-soil-200 bg-soil-50 py-3 pl-11 pr-4 text-sm font-bold text-soil-900 transition focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                  placeholder="admin@farmnest.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-soil-700">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-soil-400">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full rounded-xl border border-soil-200 bg-soil-50 py-3 pl-11 pr-12 text-sm font-bold text-soil-900 transition focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-soil-400 hover:text-soil-700 focus:outline-none transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#055205] py-4 text-sm font-black text-white shadow-lg shadow-[#055205]/30 transition hover:bg-[#043d04] disabled:opacity-70"
            >
              {isSubmitting ? 'Authenticating...' : 'Login to Dashboard'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
