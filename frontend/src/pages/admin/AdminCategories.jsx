import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const { showToast } = useToast()
  
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting, errors } } = useForm()

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/admin/categories')
      setCategories(res.data)
    } catch (error) {
      showToast('Failed to fetch categories', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const openAddModal = () => {
    setEditingCategory(null)
    reset({ name: '', description: '', image_url: '', is_active: true })
    setIsModalOpen(true)
  }

  const openEditModal = (cat) => {
    setEditingCategory(cat)
    reset({ 
      name: cat.name, 
      description: cat.description || '', 
      image_url: cat.image_url || '',
      is_active: cat.is_active 
    })
    setIsModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      if (editingCategory) {
        await api.put(`/api/admin/categories/${editingCategory.id}`, data)
        showToast('Category updated successfully', 'success')
      } else {
        await api.post('/api/admin/categories', data)
        showToast('Category created successfully', 'success')
      }
      setIsModalOpen(false)
      fetchCategories()
    } catch (error) {
      showToast(error.response?.data?.detail || 'Operation failed', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      await api.delete(`/api/admin/categories/${id}`)
      showToast('Category deleted successfully', 'success')
      fetchCategories()
    } catch (error) {
      showToast('Failed to delete category', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-soil-900">Categories</h1>
          <p className="hidden sm:block text-sm font-medium text-soil-500">Manage product categories</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 shrink-0 rounded-xl bg-[#055205] px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-bold text-white shadow-lg shadow-[#055205]/30 transition hover:bg-[#043d04]"
        >
          <FaPlus /> <span className="hidden sm:inline">Add Category</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="rounded-3xl border border-soil-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-soil-50 text-soil-500">
              <tr>
                <th className="px-6 py-4 font-bold">Image</th>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Total Products</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soil-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center font-bold text-soil-500">Loading categories...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center font-bold text-soil-500">No categories found.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-soil-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 overflow-hidden rounded-xl bg-soil-100">
                        {cat.image_url ? (
                          <img src={cat.image_url} alt={cat.name} className="h-full w-full object-cover" />
                        ) : (
                          <FaImage className="h-full w-full p-3 text-soil-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-soil-900">{cat.name}</td>
                    <td className="px-6 py-4 font-semibold text-soil-600">{cat.total_products}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(cat)} className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors">
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
              className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-black text-soil-900">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-soil-100 p-2 text-soil-500 hover:bg-soil-200 hover:text-soil-900">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-bold text-soil-700">Category Name *</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-soil-700">Description</label>
                  <textarea
                    {...register('description')}
                    rows="3"
                    className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                  ></textarea>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-soil-700">Image URL</label>
                  <input
                    {...register('image_url')}
                    className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    {...register('is_active')}
                    className="h-5 w-5 rounded border-soil-300 text-[#055205] focus:ring-[#055205]"
                  />
                  <label htmlFor="is_active" className="text-sm font-bold text-soil-700">Active Status</label>
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
                    {isSubmitting ? 'Saving...' : 'Save Category'}
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
