import React, { useState, useEffect } from 'react'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'
import { FaUserCircle, FaEye, FaTimes } from 'react-icons/fa'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const { showToast } = useToast()

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/api/admin/customers')
      setCustomers(res.data)
    } catch (error) {
      showToast('Failed to fetch customers', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleToggleStatus = async (customerId, currentStatus) => {
    try {
      await api.put(`/api/admin/customers/${customerId}/status`, { is_active: !currentStatus })
      showToast(`Customer ${currentStatus ? 'deactivated' : 'activated'}`, 'success')
      fetchCustomers()
    } catch (error) {
      showToast('Failed to update status', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-soil-900">Customers</h1>
          <p className="text-sm font-medium text-soil-500">View and manage registered customers</p>
        </div>
      </div>

      <div className="rounded-3xl border border-soil-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-soil-50 text-soil-500">
              <tr>
                <th className="px-4 py-3 font-bold text-xs uppercase text-soil-400 tracking-wider">Customer</th>
                <th className="px-4 py-3 font-bold text-xs uppercase text-soil-400 tracking-wider">Contact</th>
                <th className="px-4 py-3 font-bold text-xs uppercase text-soil-400 tracking-wider">Village / Location</th>
                <th className="px-4 py-3 font-bold text-xs uppercase text-soil-400 tracking-wider text-center">Orders</th>
                <th className="px-4 py-3 font-bold text-xs uppercase text-soil-400 tracking-wider text-right">Total Spent</th>
                <th className="px-4 py-3 font-bold text-xs uppercase text-soil-400 tracking-wider text-center">Status</th>
                <th className="px-4 py-3 font-bold text-xs uppercase text-soil-400 tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soil-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center font-bold text-soil-500">Loading customers...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center font-bold text-soil-500">No customers found.</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.customer_id} className="hover:bg-soil-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-black text-green-800">
                          {c.full_name ? c.full_name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-soil-900">{c.full_name}</p>
                          <p className="text-xs font-semibold text-soil-400 mt-0.5">ID: {c.customer_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-soil-900">{c.mobile_number}</p>
                      <p className="text-xs text-soil-500 mt-0.5">{c.email || 'No email'}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-soil-600">{c.village || 'N/A'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-black text-green-800">
                        {c.total_orders}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-black text-soil-900">₹{c.total_spending.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => handleToggleStatus(c.customer_id, c.is_active)}
                        className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-bold transition-colors ${
                          c.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {c.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => setSelectedCustomer(c)}
                        className="inline-flex items-center gap-2 rounded-full border border-soil-200 px-4 py-1.5 text-xs font-bold text-soil-700 hover:bg-soil-50 transition-colors"
                      >
                        <FaEye className="text-soil-600" />
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-soil-400 hover:text-soil-700 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
            <div className="p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl font-black text-green-800 mb-4">
                  {selectedCustomer.full_name ? selectedCustomer.full_name.charAt(0).toUpperCase() : 'C'}
                </div>
                <h2 className="text-2xl font-black text-soil-900 text-center">{selectedCustomer.full_name}</h2>
                <p className="text-sm font-semibold text-soil-400">ID: {selectedCustomer.customer_id}</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-soil-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="text-sm font-bold text-soil-500 uppercase">Status</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${selectedCustomer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedCustomer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-soil-50 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-soil-500 uppercase mb-1">Total Orders</p>
                    <p className="text-lg font-black text-soil-900">{selectedCustomer.total_orders}</p>
                  </div>
                  <div className="bg-soil-50 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-soil-500 uppercase mb-1">Total Spent</p>
                    <p className="text-lg font-black text-soil-900">₹{selectedCustomer.total_spending.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-soil-50 p-4 rounded-2xl space-y-3">
                  <div>
                    <p className="text-xs font-bold text-soil-500 uppercase">Phone</p>
                    <p className="font-semibold text-soil-900">{selectedCustomer.mobile_number}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-soil-500 uppercase">Email</p>
                    <p className="font-semibold text-soil-900">{selectedCustomer.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-soil-500 uppercase">Village / Location</p>
                    <p className="font-semibold text-soil-900">{selectedCustomer.village || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
