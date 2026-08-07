import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaImage } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const { showToast } = useToast()
  
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm()

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/api/admin/products'),
        api.get('/api/admin/categories')
      ])
      setProducts(prodRes.data)
      setCategories(catRes.data)
    } catch (error) {
      showToast('Failed to fetch data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openAddModal = () => {
    setEditingProduct(null)
    reset({ 
      name: '', description: '', price: '', stock_quantity: '', 
      unit: 'kg', category_id: '', images: '', is_active: true 
    })
    setIsModalOpen(true)
  }

  const openEditModal = (prod) => {
    setEditingProduct(prod)
    let imagesStr = ''
    if (prod.images) {
      try {
        imagesStr = JSON.parse(prod.images).join(', ')
      } catch (e) {
        imagesStr = prod.images
      }
    }
    
    reset({ 
      name: prod.name, 
      description: prod.description || '', 
      price: prod.price,
      stock_quantity: prod.stock_quantity,
      unit: prod.unit,
      category_id: prod.category_id,
      images: imagesStr,
      is_active: prod.is_active 
    })
    setIsModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      // Format images as JSON array string
      let formattedImages = data.images
      if (data.images && !data.images.startsWith('[')) {
        const urlArray = data.images.split(',').map(u => u.trim()).filter(u => u)
        formattedImages = JSON.stringify(urlArray)
      }

      const payload = {
        ...data,
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity, 10),
        images: formattedImages
      }

      if (editingProduct) {
        await api.put(`/api/admin/products/${editingProduct.id}`, payload)
        showToast('Product updated successfully', 'success')
      } else {
        await api.post('/api/admin/products', payload)
        showToast('Product created successfully', 'success')
      }
      setIsModalOpen(false)
      fetchData()
    } catch (error) {
      showToast(error.response?.data?.detail || 'Operation failed', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(`/api/admin/products/${id}`)
      showToast('Product deleted successfully', 'success')
      fetchData()
    } catch (error) {
      showToast('Failed to delete product', 'error')
    }
  }

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id)
    return cat ? cat.name : 'Unknown'
  }

  const getFirstImage = (imagesStr) => {
    if (!imagesStr) return null
    try {
      const parsed = JSON.parse(imagesStr)
      return Array.isArray(parsed) ? parsed[0] : null
    } catch {
      return imagesStr
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-soil-900">Products</h1>
          <p className="hidden sm:block text-sm font-medium text-soil-500">Manage your farm products</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 shrink-0 rounded-xl bg-[#055205] px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-bold text-white shadow-lg shadow-[#055205]/30 transition hover:bg-[#043d04]"
        >
          <FaPlus /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="rounded-3xl border border-soil-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-soil-50 text-soil-500">
              <tr>
                <th className="px-6 py-4 font-bold">Product</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soil-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center font-bold text-soil-500">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center font-bold text-soil-500">No products found.</td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-soil-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-soil-100">
                          {prod.product_image || getFirstImage(prod.images) ? (
                            <img src={prod.product_image || getFirstImage(prod.images)} alt={prod.name} className="h-full w-full object-cover" />
                          ) : (
                            <FaImage className="h-full w-full p-3 text-soil-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-soil-900">{prod.name}</p>
                          <p className="text-xs font-semibold text-soil-500 truncate max-w-[150px]">{prod.description || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-soil-600">{getCategoryName(prod.category_id)}</td>
                    <td className="px-6 py-4 font-black text-[#2d6f35]">₹{prod.price} <span className="text-xs font-semibold text-soil-400">/{prod.unit}</span></td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${prod.stock_quantity < 10 ? 'text-red-500' : 'text-soil-900'}`}>
                        {prod.stock_quantity} <span className="text-xs font-semibold text-soil-500 ml-1 capitalize">{prod.unit}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${prod.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {prod.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(prod)} className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(prod.id)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors">
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
              className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-black text-soil-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-soil-100 p-2 text-soil-500 hover:bg-soil-200 hover:text-soil-900">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-soil-700">Product Name *</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold text-soil-700">Category *</label>
                    <select
                      {...register('category_id', { required: 'Category is required' })}
                      className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                    >
                      <option value="">Select a category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id.message}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold text-soil-700">Price (₹) *</label>
                    <input
                      type="number" step="0.01"
                      {...register('price', { required: 'Price is required', min: 0 })}
                      className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                    />
                    {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="mb-1 block text-sm font-bold text-soil-700">Stock *</label>
                      <input
                        type="number"
                        {...register('stock_quantity', { required: 'Stock is required', min: 0 })}
                        className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                      />
                    </div>
                    <div className="w-24">
                      <label className="mb-1 block text-sm font-bold text-soil-700">Unit *</label>
                      <input
                        {...register('unit', { required: true })}
                        className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                        placeholder="kg, bunch"
                      />
                    </div>
                  </div>
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
                  <label className="mb-1 block text-sm font-bold text-soil-700">Image URLs (comma separated)</label>
                  <input
                    {...register('images')}
                    className="w-full rounded-xl border border-soil-200 bg-soil-50 px-4 py-2.5 text-sm font-semibold focus:border-[#055205] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#055205]"
                    placeholder="https://img1.jpg, https://img2.jpg"
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
                    {isSubmitting ? 'Saving...' : 'Save Product'}
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
