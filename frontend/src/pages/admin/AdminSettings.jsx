import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaStore, FaTruck, FaShieldAlt, FaPalette, FaBell, FaSave, 
  FaUndo, FaCreditCard, FaDatabase, FaImage, FaLaptopCode, FaCheck,
  FaDesktop, FaMoon, FaSun
} from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('Store')
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { showToast } = useToast()
  
  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting, isDirty } } = useForm()

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/admin/settings')
      reset({
        store_name: res.data.store_name || '',
        support_email: res.data.support_email || '',
        store_address: res.data.store_address || '',
        contact_number: res.data.contact_number || '',
        
        max_delivery_radius: res.data.max_delivery_radius || 15,
        base_delivery_charge: res.data.base_delivery_charge || 40,
        free_delivery_limit: res.data.free_delivery_limit || 500,
        
        slot_morning_active: res.data.slot_morning_active ?? true,
        slot_afternoon_active: res.data.slot_afternoon_active ?? true,
        slot_evening_active: res.data.slot_evening_active ?? false,
        
        payment_cod_active: res.data.payment_cod_active ?? true,
        payment_upi_active: res.data.payment_upi_active ?? true,
        payment_razorpay_active: res.data.payment_razorpay_active ?? false,
        payment_stripe_active: res.data.payment_stripe_active ?? false,
        
        notif_new_order: res.data.notif_new_order ?? true,
        notif_low_stock: res.data.notif_low_stock ?? true,
        notif_new_customer: res.data.notif_new_customer ?? false,
        notif_negative_review: res.data.notif_negative_review ?? false,
        
        compact_mode: res.data.compact_mode ?? false
      })
      setIsDarkMode(res.data.is_dark_mode)
    } catch (error) {
      showToast('Failed to load settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // Apply dark mode immediately when state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleDownloadBackup = async () => {
    try {
      showToast('Generating backup...', 'info')
      const response = await api.get('/api/admin/settings/backup', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      const contentDisposition = response.headers['content-disposition']
      let filename = 'farmnest_backup.json'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1]
        }
      }
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      showToast('Backup downloaded successfully', 'success')
    } catch (error) {
      showToast('Failed to download backup', 'error')
    }
  }

  const onSave = async (data) => {
    try {
      await api.put('/api/admin/settings', {
        ...data,
        is_dark_mode: isDarkMode
      })
      showToast('Settings saved successfully', 'success')
      reset(data) // reset isDirty state
    } catch (error) {
      showToast('Failed to save settings', 'error')
    }
  }

  const tabs = [
    { id: 'Store', icon: FaStore, label: 'General Settings' },
    { id: 'Delivery', icon: FaTruck, label: 'Delivery Areas' },
    { id: 'Payment', icon: FaCreditCard, label: 'Payment Providers' },
    { id: 'Notifications', icon: FaBell, label: 'Alerts & Emails' },
    { id: 'Theme', icon: FaPalette, label: 'Appearance' },
    { id: 'Security', icon: FaShieldAlt, label: 'Security & Access' },
    { id: 'Backup', icon: FaDatabase, label: 'Maintenance' },
  ]

  const containerVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.2 } }
  }

  // Helper toggle component
  const Toggle = ({ active, onClick }) => (
    <button type="button" onClick={onClick} className={`relative h-6 w-11 rounded-full transition-colors ${active ? 'bg-indigo-600' : 'bg-soil-300 dark:bg-soil-600'}`}>
      <motion.div layout className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm" animate={{ x: active ? 20 : 0 }} transition={{ type: "spring", stiffness: 700, damping: 30 }} />
    </button>
  )

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-soil-200 dark:bg-soil-700 rounded-xl"></div>
          <div className="h-32 w-full bg-soil-100 dark:bg-soil-800 rounded-2xl"></div>
          <div className="h-32 w-full bg-soil-100 dark:bg-soil-800 rounded-2xl"></div>
        </div>
      )
    }

    switch (activeTab) {
      case 'Store':
        return (
          <motion.div key="Store" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
            <div className="border-b border-soil-100 dark:border-soil-800 pb-5">
              <h2 className="text-xl font-black text-soil-900 dark:text-white tracking-tight">General Settings</h2>
              <p className="text-sm font-medium text-soil-500 dark:text-soil-400 mt-1">Manage your public-facing farm profile.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Brand Logo</h3>
                <p className="text-xs text-soil-500 mt-1">Used on invoices and emails. Max 2MB.</p>
              </div>
              <div className="md:col-span-2">
                <div className="border-2 border-dashed border-soil-200 dark:border-soil-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-soil-50 dark:bg-soil-800/50 hover:bg-soil-100 transition-colors cursor-pointer group">
                  <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><FaImage /></div>
                  <p className="text-sm font-bold text-soil-700 dark:text-soil-300">Click to upload logo</p>
                  <p className="text-xs text-soil-400 mt-1">SVG, PNG, JPG or GIF</p>
                </div>
              </div>
            </div>

            <hr className="border-soil-100 dark:border-soil-800" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Store Information</h3>
                <p className="text-xs text-soil-500 mt-1">Basic contact and location details.</p>
              </div>
              <div className="md:col-span-2 space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-soil-700 dark:text-soil-400 uppercase tracking-wider">Store Name</label>
                  <input type="text" {...register('store_name')} className="w-full rounded-xl border border-soil-200 bg-white dark:bg-soil-800 dark:border-soil-700 px-4 py-2.5 text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-soil-700 dark:text-soil-400 uppercase tracking-wider">Support Email</label>
                    <input type="email" {...register('support_email')} className="w-full rounded-xl border border-soil-200 bg-white dark:bg-soil-800 dark:border-soil-700 px-4 py-2.5 text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-soil-700 dark:text-soil-400 uppercase tracking-wider">Contact Number</label>
                    <input type="tel" {...register('contact_number')} className="w-full rounded-xl border border-soil-200 bg-white dark:bg-soil-800 dark:border-soil-700 px-4 py-2.5 text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-soil-700 dark:text-soil-400 uppercase tracking-wider">Store Address</label>
                  <textarea rows="3" {...register('store_address')} className="w-full rounded-xl border border-soil-200 bg-white dark:bg-soil-800 dark:border-soil-700 px-4 py-2.5 text-sm font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"></textarea>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'Delivery':
        return (
          <motion.div key="Delivery" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
            <div className="border-b border-soil-100 dark:border-soil-800 pb-5">
              <h2 className="text-xl font-black text-soil-900 dark:text-white tracking-tight">Delivery Areas & Fees</h2>
              <p className="text-sm font-medium text-soil-500 dark:text-soil-400 mt-1">Configure your local delivery parameters.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Delivery Parameters</h3>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-soil-700 dark:text-soil-400 uppercase tracking-wider">Max Delivery Radius (km)</label>
                  <input type="number" {...register('max_delivery_radius')} className="w-full rounded-xl border border-soil-200 bg-white dark:bg-soil-800 dark:border-soil-700 px-4 py-2.5 text-sm font-semibold focus:border-indigo-500 shadow-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-soil-700 dark:text-soil-400 uppercase tracking-wider">Base Charge (₹)</label>
                  <input type="number" {...register('base_delivery_charge')} className="w-full rounded-xl border border-soil-200 bg-white dark:bg-soil-800 dark:border-soil-700 px-4 py-2.5 text-sm font-semibold focus:border-indigo-500 shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-soil-700 dark:text-soil-400 uppercase tracking-wider">Free Delivery Limit (₹)</label>
                  <input type="number" {...register('free_delivery_limit')} className="w-full rounded-xl border border-soil-200 bg-white dark:bg-soil-800 dark:border-soil-700 px-4 py-2.5 text-sm font-semibold focus:border-indigo-500 shadow-sm" />
                </div>
              </div>
            </div>

            <hr className="border-soil-100 dark:border-soil-800" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Time Slots</h3>
              </div>
              <div className="md:col-span-2 space-y-3">
                {[
                  { label: 'Morning (08:00 AM - 12:00 PM)', field: 'slot_morning_active' },
                  { label: 'Afternoon (12:00 PM - 04:00 PM)', field: 'slot_afternoon_active' },
                  { label: 'Evening (04:00 PM - 08:00 PM)', field: 'slot_evening_active' }
                ].map((slot, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-soil-200 dark:border-soil-700 bg-soil-50 dark:bg-soil-800/50">
                    <span className="text-sm font-bold text-soil-700 dark:text-soil-300">{slot.label}</span>
                    <Toggle active={watch(slot.field)} onClick={() => setValue(slot.field, !watch(slot.field), { shouldDirty: true })} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'Theme':
        return (
          <motion.div key="Theme" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
            <div className="border-b border-soil-100 dark:border-soil-800 pb-5">
              <h2 className="text-xl font-black text-soil-900 dark:text-white tracking-tight">Appearance</h2>
              <p className="text-sm font-medium text-soil-500 dark:text-soil-400 mt-1">Customize the look and feel of the admin panel.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Color Mode</h3>
                <p className="text-xs text-soil-500 mt-1">Select your preferred lighting.</p>
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button type="button" onClick={() => setIsDarkMode(false)} className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${!isDarkMode ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-soil-200 dark:border-soil-700 hover:border-indigo-300'}`}>
                  <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-500"><FaSun size={20}/></div>
                  <span className="text-sm font-bold text-soil-900 dark:text-white">Light</span>
                </button>
                <button type="button" onClick={() => setIsDarkMode(true)} className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${isDarkMode ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-soil-200 dark:border-soil-700 hover:border-indigo-300'}`}>
                  <div className="h-10 w-10 rounded-full bg-soil-900 shadow-sm flex items-center justify-center text-indigo-400"><FaMoon size={18}/></div>
                  <span className="text-sm font-bold text-soil-900 dark:text-white">Dark</span>
                </button>
                <button type="button" className="flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-soil-200 dark:border-soil-700 hover:border-indigo-300 transition-all opacity-50 cursor-not-allowed">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><FaDesktop size={18}/></div>
                  <span className="text-sm font-bold text-soil-900 dark:text-white">System</span>
                </button>
              </div>
            </div>

            <hr className="border-soil-100 dark:border-soil-800" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Interface Density</h3>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between p-5 rounded-2xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-900 shadow-sm">
                  <div>
                    <p className="font-bold text-soil-900 dark:text-white">Compact Mode</p>
                    <p className="text-xs text-soil-500 mt-1">Reduce spacing to fit more data on screen</p>
                  </div>
                  <Toggle active={watch('compact_mode')} onClick={() => setValue('compact_mode', !watch('compact_mode'), { shouldDirty: true })} />
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'Payment':
        return (
          <motion.div key="Payment" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
             <div className="border-b border-soil-100 dark:border-soil-800 pb-5">
              <h2 className="text-xl font-black text-soil-900 dark:text-white tracking-tight">Payment Providers</h2>
              <p className="text-sm font-medium text-soil-500 dark:text-soil-400 mt-1">Manage supported checkout methods.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Methods</h3>
              </div>
              <div className="md:col-span-2 space-y-4">
                {[
                  { name: 'Cash on Delivery', desc: 'Allow customers to pay on arrival', field: 'payment_cod_active' },
                  { name: 'UPI (Google Pay, PhonePe)', desc: 'Direct bank transfers via UPI', field: 'payment_upi_active' },
                  { name: 'Razorpay', desc: 'Credit cards, wallets, and net banking', field: 'payment_razorpay_active' },
                  { name: 'Stripe', desc: 'International card payments', field: 'payment_stripe_active' },
                ].map((pay, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 rounded-2xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-900 shadow-sm">
                    <div>
                      <p className="font-bold text-soil-900 dark:text-white">{pay.name}</p>
                      <p className="text-xs text-soil-500 mt-1">{pay.desc}</p>
                    </div>
                    <Toggle active={watch(pay.field)} onClick={() => setValue(pay.field, !watch(pay.field), { shouldDirty: true })} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'Notifications':
        return (
          <motion.div key="Notifications" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
            <div className="border-b border-soil-100 dark:border-soil-800 pb-5">
              <h2 className="text-xl font-black text-soil-900 dark:text-white tracking-tight">Notifications</h2>
              <p className="text-sm font-medium text-soil-500 dark:text-soil-400 mt-1">Configure automated alerts.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Admin Alerts</h3>
                <p className="text-xs text-soil-500 mt-1">What you want to be notified about.</p>
              </div>
              <div className="md:col-span-2 space-y-3 bg-soil-50 dark:bg-soil-800/50 rounded-2xl p-4 border border-soil-200 dark:border-soil-700">
                {[
                  { label: 'New Orders Received', field: 'notif_new_order' },
                  { label: 'Low Stock Warnings (< 10 items)', field: 'notif_low_stock' },
                  { label: 'New Customer Signups', field: 'notif_new_customer' },
                  { label: 'Negative Reviews (≤ 2 stars)', field: 'notif_negative_review' }
                ].map((alert, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-soil-800 cursor-pointer transition">
                    <input type="checkbox" {...register(alert.field)} className="w-4 h-4 rounded border-soil-300 text-indigo-600 focus:ring-indigo-600" />
                    <span className="text-sm font-bold text-soil-700 dark:text-soil-200">{alert.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 'Backup':
        return (
          <motion.div key="Backup" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
            <div className="border-b border-soil-100 dark:border-soil-800 pb-5">
              <h2 className="text-xl font-black text-soil-900 dark:text-white tracking-tight">System Maintenance</h2>
              <p className="text-sm font-medium text-soil-500 dark:text-soil-400 mt-1">Database backups and health checks.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Data Backup</h3>
              </div>
              <div className="md:col-span-2 p-6 rounded-2xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-900 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
                <div>
                  <p className="font-bold text-soil-900 dark:text-white">Manual Backup</p>
                  <p className="text-xs text-soil-500 mt-1">Export full database dump (JSON)</p>
                  <p className="text-[10px] font-semibold text-emerald-600 mt-2">Last backup: Today at 02:00 AM</p>
                </div>
                <button type="button" onClick={handleDownloadBackup} className="px-5 py-2.5 rounded-xl bg-soil-900 dark:bg-white text-white dark:text-soil-900 text-sm font-bold shadow-md hover:opacity-90">
                  Generate Backup
                </button>
              </div>
            </div>
            <hr className="border-soil-100 dark:border-soil-800" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">System Health</h3>
              </div>
              <div className="md:col-span-2">
                <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 flex items-center justify-center"><FaCheck /></div>
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-400">All Systems Operational</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-0.5">Database connection stable. API latency 42ms.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      
      case 'Security':
        return (
          <motion.div key="Security" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
             <div className="border-b border-soil-100 dark:border-soil-800 pb-5">
              <h2 className="text-xl font-black text-soil-900 dark:text-white tracking-tight">Security</h2>
              <p className="text-sm font-medium text-soil-500 dark:text-soil-400 mt-1">Protect your administrator account.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Two-Factor Authentication</h3>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between p-5 rounded-2xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-900 shadow-sm">
                  <div>
                    <p className="font-bold text-soil-900 dark:text-white">Authenticator App</p>
                    <p className="text-xs text-soil-500 mt-1">Use an app like Google Authenticator</p>
                  </div>
                  <button type="button" className="px-4 py-2 rounded-lg border border-soil-200 dark:border-soil-700 text-xs font-bold text-soil-700 dark:text-soil-300 hover:bg-soil-50 dark:hover:bg-soil-800">
                    Enable
                  </button>
                </div>
              </div>
            </div>
            <hr className="border-soil-100 dark:border-soil-800" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-sm font-bold text-soil-900 dark:text-white">Active Sessions</h3>
              </div>
              <div className="md:col-span-2 space-y-3">
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FaLaptopCode className="text-indigo-500 text-xl" />
                    <div>
                      <p className="text-sm font-bold text-soil-900 dark:text-white">Mac OS • Chrome</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400">Current Session (Mumbai, IN)</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-soil-200 dark:border-soil-700 bg-white dark:bg-soil-900 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FaDesktop className="text-soil-400 text-xl" />
                    <div>
                      <p className="text-sm font-bold text-soil-900 dark:text-white">Windows • Firefox</p>
                      <p className="text-xs text-soil-500">Last active 3 days ago</p>
                    </div>
                  </div>
                  <button type="button" className="text-xs font-bold text-red-500 hover:text-red-700">Revoke</button>
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-56 shrink-0">
          <div className="md:sticky md:top-0">
            <div className="mb-6">
              <h1 className="text-3xl font-black text-soil-900 dark:text-white tracking-tight">Settings</h1>
            </div>
            <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-soil-200/50 dark:bg-soil-800 text-soil-900 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-soil-100 dark:hover:bg-soil-800 hover:text-soil-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex w-5 items-center justify-center shrink-0">
                    <Icon className={`${isActive ? 'text-indigo-600' : 'text-gray-500'} text-lg`} />
                  </div>
                  {tab.label}
                </button>
              )
            })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-[500px]">
          <form id="settings-form" onSubmit={handleSubmit(onSave)}>
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </form>
        </div>
      </div>

      {/* Sticky Save Footer (Vercel Style) */}
      <AnimatePresence>
        {(isDirty || activeTab === 'Theme') && !loading && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
          >
            <div className="max-w-4xl mx-auto rounded-2xl bg-soil-900/90 dark:bg-soil-800/95 backdrop-blur-md border border-soil-700 p-4 shadow-2xl flex items-center justify-between pointer-events-auto">
              <div className="text-white text-sm font-semibold hidden sm:block px-4">
                You have unsaved changes.
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button type="button" onClick={() => { fetchSettings(); reset() }} className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-bold text-soil-300 hover:text-white hover:bg-soil-700 transition">
                  Reset
                </button>
                <button type="submit" form="settings-form" disabled={isSubmitting} className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-white text-soil-900 text-sm font-bold shadow-md hover:bg-soil-100 transition disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
