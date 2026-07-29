import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../api/auth'
import { extractErrorMessage } from '../api/client'

export default function CustomerProfilePanel({ customer, open, onClose, onLogout }) {
  const navigate = useNavigate()
  const { updateCustomer } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    village: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (customer) {
      setFormData({
        full_name: customer.full_name || '',
        mobile_number: customer.mobile_number || '',
        email: customer.email || '',
        village: customer.village || '',
      })
    }
    setIsEditing(false)
    setError('')
    setSuccessMsg('')
  }, [customer, open])

  if (!open) return null

  const createdAt = customer?.created_at
    ? new Date(customer.created_at).toLocaleDateString()
    : 'Not available'
  const initial = customer?.full_name?.charAt(0)?.toUpperCase() || 'C'

  const handleMyOrdersClick = () => {
    onClose()
    navigate('/orders')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!formData.full_name.trim()) {
      setError('Full name is required')
      return
    }
    if (!formData.mobile_number.trim() || !/^[6-9]\d{9}$/.test(formData.mobile_number)) {
      setError('Enter a valid 10-digit mobile number')
      return
    }

    setSaving(true)
    try {
      const updated = await updateProfile({
        full_name: formData.full_name.trim(),
        mobile_number: formData.mobile_number.trim(),
        email: formData.email.trim() || null,
        village: formData.village.trim() || null,
      })
      updateCustomer(updated)
      setSuccessMsg('Profile updated successfully!')
      setTimeout(() => {
        setIsEditing(false)
        setSuccessMsg('')
      }, 1200)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-3 sm:items-center sm:justify-end sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-[92vw] max-w-sm rounded-3xl bg-white/95 p-4 shadow-2xl backdrop-blur-md sm:max-w-md sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header - View Mode vs Edit Mode */}
        {!isEditing ? (
          <div className="relative flex flex-col items-center pb-2 pt-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3d7042] text-2xl font-bold text-white shadow-sm">
              {initial}
            </div>
            <h2 className="mt-3 font-display text-lg font-bold text-soil-800">
              {customer?.full_name || 'Customer'}
            </h2>
            <p className="text-[11px] font-medium text-soil-500">
              Customer Account
            </p>
            
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-soil-100 bg-white text-soil-500 shadow-sm transition hover:bg-soil-50"
              aria-label="Edit Profile"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-display text-lg font-bold text-soil-800">Edit Profile</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-soil-100 bg-white text-soil-500 hover:bg-soil-50"
            >
              ✕
            </button>
          </div>
        )}

        {/* Feedback alerts */}
        {error && (
          <div className="mt-3 rounded-xl bg-red-50 p-2.5 text-xs text-red-600 font-medium border border-red-100">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mt-3 rounded-xl bg-green-50 p-2.5 text-xs text-green-700 font-medium border border-green-100">
            {successMsg}
          </div>
        )}

        {/* Body: Edit Mode vs View Mode */}
        {isEditing ? (
          <form onSubmit={handleSubmitEdit} className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-soil-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                readOnly
                className="w-full rounded-xl border border-soil-200 bg-soil-50 px-3 py-2 text-sm font-semibold text-soil-500 cursor-not-allowed focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-soil-500 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  readOnly
                  className="w-full rounded-xl border border-soil-200 bg-soil-50 px-3 py-2 text-sm font-semibold text-soil-500 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-soil-500 mb-1">
                  Customer ID
                </label>
                <div className="w-full rounded-xl border border-soil-100 bg-soil-50 px-3 py-2 text-sm font-bold text-soil-400">
                  {customer?.customer_id}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-soil-500 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-sm font-semibold text-soil-700 focus:border-leaf-500 focus:outline-none focus:ring-1 focus:ring-leaf-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-soil-500 mb-1">
                Village / Location
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-sm font-semibold text-soil-700 focus:border-leaf-500 focus:outline-none focus:ring-1 focus:ring-leaf-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setError('')
                }}
                disabled={saving}
                className="flex-1 rounded-xl border border-soil-200 bg-white py-2.5 text-xs font-bold text-soil-700 transition hover:bg-soil-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-leaf-600 py-2.5 text-xs font-bold !text-white shadow-sm transition hover:bg-leaf-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Read-Only Details List */}
            <div className="mt-3 flex flex-col rounded-2xl bg-white/60">
              <ProfileRow label="Customer ID" value={customer?.customer_id} />
              <ProfileRow label="Mobile Number" value={customer?.mobile_number} />
              <ProfileRow label="Village" value={customer?.village} />
              <ProfileRow label="Email" value={customer?.email} isLast />
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleMyOrdersClick}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f2f7f1] px-4 py-2.5 text-sm font-bold text-[#3d7042] transition hover:bg-[#e6f0e4]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                My Orders
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-xl bg-[#3d7042] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#325e36]"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ProfileRow({ label, value, isLast = false }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2.5 ${isLast ? '' : 'border-b border-soil-100'}`}>
      <span className="text-[11px] font-medium text-soil-500">{label}</span>
      <span className="text-[11px] font-bold text-soil-800">{value || '-'}</span>
    </div>
  )
}
