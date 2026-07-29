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
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff3bd] text-xl font-bold text-[#118707] sm:h-14 sm:w-14 sm:text-2xl">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-leaf-600 sm:text-xs">
                Customer Profile
              </p>
              <h2 className="mt-0.5 truncate font-display text-lg font-semibold text-soil-700 sm:text-2xl">
                {customer?.full_name || 'Customer'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-soil-100 bg-white/80 text-base font-bold text-soil-700 hover:bg-soil-100 sm:h-9 sm:w-9"
            aria-label="Close profile details"
          >
            ✕
          </button>
        </div>

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
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-sm font-semibold text-soil-700 focus:border-leaf-500 focus:outline-none focus:ring-1 focus:ring-leaf-500"
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
                  onChange={handleChange}
                  required
                  maxLength={10}
                  className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-sm font-semibold text-soil-700 focus:border-leaf-500 focus:outline-none focus:ring-1 focus:ring-leaf-500"
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
            {/* Read-Only Details Grid */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
              <ProfileRow label="Customer ID" value={customer?.customer_id} />
              <ProfileRow label="Mobile Number" value={customer?.mobile_number} />
              <ProfileRow label="Email" value={customer?.email} wide />
              <ProfileRow label="Village / Location" value={customer?.village} />
              <ProfileRow label="Member Since" value={createdAt} />
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleMyOrdersClick}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-leaf-200 bg-leaf-50/70 px-3 py-2.5 text-xs font-bold text-leaf-700 transition hover:bg-leaf-100"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  My Orders
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-soil-200 bg-soil-50/70 px-3 py-2.5 text-xs font-bold text-soil-700 transition hover:bg-soil-100"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-2xl bg-leaf-600 px-4 py-2.5 text-xs sm:text-sm font-bold !text-white shadow-sm transition hover:bg-leaf-700"
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

function ProfileRow({ label, value, wide = false }) {
  return (
    <div className={`rounded-2xl border border-soil-100 bg-soil-50/80 px-3 py-2.5 sm:px-4 sm:py-3 ${wide ? 'col-span-2' : ''}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-soil-400 sm:text-xs">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-soil-700">
        {value || 'Not available'}
      </p>
    </div>
  )
}
