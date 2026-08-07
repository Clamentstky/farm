import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaMotorcycle } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'

export default function AdminDelivery() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState(null)
  const { showToast } = useToast()
  
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm()

  const fetchPartners = async () => {
    try {
      const res = await api.get('/api/admin/delivery/partners')
      setPartners(res.data)
    } catch (error) {
      showToast('Failed to fetch delivery partners', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const openAddModal = () => {
    setEditingPartner(null)
    reset({ name: '', mobile: '', village_coverage: '', status: 'Active' })
    setIsModalOpen(true)
  }

  const openEditModal = (p) => {
    setEditingPartner(p)
    reset({ 
      name: p.name, 
      mobile: p.mobile, 
      village_coverage: p.village_coverage || '',
      status: p.status 
    })
    setIsModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      if (editingPartner) {
        await api.put(`/api/admin/delivery/partners/${editingPartner.id}`, data)
        showToast('Partner updated successfully', 'success')
      } else {
        await api.post('/api/admin/delivery/partners', data)
        showToast('Partner created successfully', 'success')
      }
      setIsModalOpen(false)
      fetchPartners()
    } catch (error) {
      showToast(error.response?.data?.detail || 'Operation failed', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this delivery partner?')) return
    try {
      await api.delete(`/api/admin/delivery/partners/${id}`)
      showToast('Partner deleted successfully', 'success')
      fetchPartners()
    } catch (error) {
      showToast('Failed to delete partner', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-soil-900">Delivery Partners</h1>
          <p className="hidden sm:block text-sm font-medium text-soil-500">Manage your delivery fleet</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 shrink-0 rounded-xl bg-[#055205] px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-bold text-white shadow-lg shadow-[#055205]/30 transition hover:bg-[#043d04]"
        >
          <FaPlus /> <span className="hidden sm:inline">Add Partner</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="rounded-3xl border border-soil-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-soil-50 text-soil-500">
              <tr>
                <th className="px-6 py-4 font-bold">Partner Info</th>
                <th className="px-6 py-4 font-bold">Coverage Area</th>
                <th className="px-6 py-4 font-bold text-center">Active Jobs</th>
                <th className="px-6 py-4 font-bold text-center">Completed</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soil-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center font-bold text-soil-500">Loading partners...</td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center font-bold text-soil-500">No delivery partners found.</td>
                </tr>
              ) : (
                partners.map((p) => (
                  <tr key={p.id} className="hover:bg-soil-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                          <FaMotorcycle className="text-xl" />
                        </div>
                        <div>
                          <p className="font-bold text-soil-900">{p.name}</p>
                          <p className="text-xs font-semibold text-soil-500">{p.mobile}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-soil-600">{p.village_coverage || 'All Areas'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-orange-600">{p.assigned_orders}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-green-600">{p.delivered_orders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                        p.status === 'Active' ? 'bg-green-100 text-green-700' : 
                        p.status === 'On Leave' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(p)} className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-soil-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-black text-soil-900">{editingPartner ? 'Edit Partner' : 'Add Partner'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-soil-100 p-2 text-soil-500 hover:bg-soil-200 hover:text-soil-900">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-bold text-soil-700">Full Name *</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-soil-700">Mobile Number *</label>
                  <input
                    {...register('mobile', { required: 'Mobile is required' })}
                    className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                  />
                  {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-soil-700">Village Coverage</label>
                  <input
                    {...register('village_coverage')}
                    placeholder="E.g., North Village, South Farms"
                    className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-soil-700">Status</label>
                  <select
                    {...register('status')}
                    className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-soil-600 hover:bg-soil-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#055205] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#055205]/30 hover:bg-[#043d04] disabled:opacity-70"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Partner'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
