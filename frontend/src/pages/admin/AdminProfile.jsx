import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaLock, FaHistory, FaCamera, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useForm } from 'react-hook-form'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'

export default function AdminProfile() {
  const { admin, setAdmin } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('Personal')
  const [showPassword, setShowPassword] = useState(false)
  const { showToast } = useToast()
  
  const { register: regProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { isSubmitting: isSubmittingProfile } } = useForm()
  const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { isSubmitting: isSubmittingPassword } } = useForm()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/admin/profile/me')
        resetProfile({
          name: res.data.name,
          email: res.data.email
        })
      } catch (error) {
        showToast('Failed to load profile', 'error')
      }
    }
    fetchProfile()
  }, [])

  const onProfileSave = async (data) => {
    try {
      const res = await api.put('/api/admin/profile/me', data)
      showToast('Profile updated successfully', 'success')
      // Update global context
      setAdmin(res.data)
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to update profile', 'error')
    }
  }

  const onPasswordSave = async (data) => {
    if (data.new_password !== data.confirm_password) {
      showToast('New passwords do not match', 'error')
      return
    }
    try {
      await api.put('/api/admin/profile/password', {
        current_password: data.current_password,
        new_password: data.new_password
      })
      showToast('Password updated successfully', 'success')
      resetPassword()
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to update password', 'error')
    }
  }

  const tabs = [
    { id: 'Personal', icon: FaUser, label: 'Personal Info' },
    { id: 'Security', icon: FaLock, label: 'Security & Password' },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Personal':
        return (
          <motion.div key="Personal" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-soil-100 dark:border-soil-700 pb-8">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-[#055205] text-white flex items-center justify-center text-4xl font-black shadow-lg">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-soil-600 hover:text-[#055205] border border-soil-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaCamera />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-black text-soil-900 dark:text-white">{admin?.name || 'Admin User'}</h3>
                <p className="text-sm font-semibold text-soil-500 capitalize">{admin?.role || 'Super Admin'}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div> Active Account
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit(onProfileSave)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-bold text-soil-700 dark:text-soil-300">Full Name</label>
                  <input type="text" {...regProfile('name', { required: true })} className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-soil-700 dark:text-soil-300">Email Address</label>
                  <input type="email" {...regProfile('email', { required: true })} className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]" />
                </div>
              </div>
              
              <div className="pt-8 flex justify-end">
                <button type="submit" disabled={isSubmittingProfile} className="flex items-center gap-2 rounded-xl bg-[#055205] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#055205]/30 hover:bg-[#043d04] transition disabled:opacity-70">
                  <FaSave /> {isSubmittingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        )
      
      case 'Security':
        return (
          <motion.div key="Security" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-soil-900 dark:text-white">Change Password</h3>
              <p className="text-xs font-semibold text-soil-500 dark:text-soil-400">Ensure your account is using a long, random password to stay secure.</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="max-w-md space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-soil-700 dark:text-soil-300">Current Password</label>
                <input type="password" {...regPassword('current_password', { required: true })} placeholder="••••••••" className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]" />
              </div>
              
              <div className="relative">
                <label className="mb-1 block text-sm font-bold text-soil-700 dark:text-soil-300">New Password</label>
                <input type={showPassword ? "text" : "password"} {...regPassword('new_password', { required: true })} placeholder="••••••••" className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 pr-10 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-soil-400 hover:text-soil-600">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-bold text-soil-700 dark:text-soil-300">Confirm New Password</label>
                <input type={showPassword ? "text" : "password"} {...regPassword('confirm_password', { required: true })} placeholder="••••••••" className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]" />
              </div>

              <div className="pt-4 border-t border-soil-100 flex justify-start">
                <button type="submit" disabled={isSubmittingPassword} className="flex items-center gap-2 rounded-xl bg-soil-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-black transition disabled:opacity-70">
                  {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-soil-900 dark:text-white">Profile</h1>
            <p className="mt-1 text-sm font-medium text-soil-500 dark:text-soil-400 leading-relaxed">Manage your account settings and preferences</p>
          </div>

          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-leaf-50 text-[#055205] shadow-sm' 
                      : 'text-soil-600 dark:text-soil-400 hover:bg-soil-50 dark:hover:bg-soil-800 hover:text-soil-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="text-lg" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 rounded-3xl bg-white dark:bg-soil-800 p-6 sm:p-8 shadow-sm border border-soil-100 dark:border-soil-700 h-fit">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
