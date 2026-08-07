import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaUsers, FaBoxOpen, FaClipboardList, FaLayerGroup, 
  FaRupeeSign, FaChartLine, FaExclamationTriangle, FaEye,
  FaCheckCircle, FaClock, FaTruck, FaTimesCircle
} from 'react-icons/fa'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import api from '../../api/client'
import { useAdminAuth } from '../../context/AdminAuthContext'

const mockChartData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
]

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Preparing: 'bg-purple-100 text-purple-700 border-purple-200',
  'Out for Delivery': 'bg-orange-100 text-orange-700 border-orange-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminDashboard() {
  const { admin } = useAdminAuth()
  const [summary, setSummary] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, ordRes, prodRes] = await Promise.all([
          api.get('/api/admin/dashboard/summary'),
          api.get('/api/admin/orders'),
          api.get('/api/admin/products')
        ])
        
        setSummary(sumRes.data)
        setRecentOrders(ordRes.data.slice(0, 5)) // Get latest 5
        
        const lowStockItems = prodRes.data.filter(p => p.stock_quantity < 10)
        setLowStock(lowStockItems)
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) return <div className="flex h-full items-center justify-center font-bold text-soil-500">Loading Dashboard...</div>

  const cardThemes = {
    purple: { iconBg: 'bg-purple-500', decBg: 'bg-purple-50' },
    orange: { iconBg: 'bg-orange-500', decBg: 'bg-orange-50' },
    blue: { iconBg: 'bg-blue-500', decBg: 'bg-blue-50' },
    gray: { iconBg: 'bg-gray-800', decBg: 'bg-gray-50' },
    yellow: { iconBg: 'bg-amber-500', decBg: 'bg-amber-50' },
    green: { iconBg: 'bg-emerald-600', decBg: 'bg-emerald-50' },
    indigo: { iconBg: 'bg-indigo-500', decBg: 'bg-indigo-50' },
    teal: { iconBg: 'bg-[#2dd4bf]', decBg: 'bg-teal-50' },
  }

  const StatCard = ({ title, value, icon: Icon, theme, delay }) => {
    const t = cardThemes[theme] || cardThemes.gray
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-6 shadow-sm border border-soil-100 group hover:shadow-md transition-shadow"
      >
        <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] sm:text-sm font-bold text-soil-500 whitespace-nowrap tracking-tight sm:tracking-normal">{title}</p>
            <p className="mt-0.5 sm:mt-2 text-xl sm:text-3xl font-black text-soil-900">{value}</p>
          </div>
          <div className={`flex h-8 w-8 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-[20px] ${t.iconBg} text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="text-sm sm:text-2xl" />
          </div>
        </div>
        <div className={`absolute -bottom-6 -right-6 h-16 w-16 sm:h-24 sm:w-24 rounded-full ${t.decBg} opacity-50 group-hover:scale-150 transition-transform duration-500`} />
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-soil-900">Dashboard Overview</h1>
          <p className="text-sm font-medium text-soil-500">Welcome back, {admin?.name}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Customers" value={summary?.total_customers || 0} icon={FaUsers} theme="purple" delay={0.1} />
        <StatCard title="Total Categories" value={summary?.total_categories || 0} icon={FaLayerGroup} theme="orange" delay={0.15} />
        <StatCard title="Total Products" value={summary?.total_products || 0} icon={FaBoxOpen} theme="blue" delay={0.2} />
        <StatCard title="Total Orders" value={summary?.total_orders || 0} icon={FaClipboardList} theme="gray" delay={0.25} />
        <StatCard title="Pending Orders" value={summary?.pending_orders || 0} icon={FaClock} theme="yellow" delay={0.3} />
        <StatCard title="Delivered Orders" value={summary?.delivered_orders || 0} icon={FaTruck} theme="green" delay={0.35} />
        <StatCard title="Today's Revenue" value={`₹${summary?.todays_revenue || 0}`} icon={FaChartLine} theme="indigo" delay={0.4} />
        <StatCard title="Total Revenue" value={`₹${summary?.total_revenue || 0}`} icon={FaRupeeSign} theme="teal" delay={0.45} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="col-span-1 rounded-3xl border border-soil-100 bg-white p-6 shadow-sm lg:col-span-2"
        >
          <h2 className="mb-6 text-lg font-bold text-soil-900">Revenue Analytics (Weekly)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary?.weekly_revenue || mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f4f7f4' }} />
                <Bar dataKey="revenue" fill="#055205" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="col-span-1 rounded-3xl border border-red-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-soil-900">
              <FaExclamationTriangle className="text-red-500" />
              Low Stock Alerts
            </h2>
            <Link to="/admin/products" className="text-xs font-bold text-[#055205] hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {lowStock.length > 0 ? lowStock.map(product => (
              <div key={product.id} className="flex items-center justify-between rounded-xl border border-soil-100 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-soil-100">
                    {product.images ? (
                      <img src={JSON.parse(product.images)[0]} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <FaBoxOpen className="h-full w-full p-2 text-soil-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-soil-900">{product.name}</p>
                    <p className="text-xs font-semibold text-red-500">Only {product.stock_quantity} {product.unit} left</p>
                  </div>
                </div>
                <Link to={`/admin/products?edit=${product.id}`} className="rounded-lg bg-soil-100 px-3 py-1.5 text-xs font-bold text-soil-700 hover:bg-soil-200 transition-colors">
                  Restock
                </Link>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <FaCheckCircle className="mb-2 text-3xl text-leaf-500" />
                <p className="text-sm font-bold text-soil-500">All products are well stocked!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="col-span-1 lg:col-span-2 rounded-3xl border border-soil-100 bg-white p-6 shadow-sm overflow-hidden"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-soil-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-bold text-[#055205] hover:underline">View All Orders</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-soil-50 text-soil-500">
                <tr>
                  <th className="rounded-l-xl px-4 py-3 font-bold">Order ID</th>
                  <th className="px-4 py-3 font-bold">Customer ID</th>
                  <th className="px-4 py-3 font-bold">Items</th>
                  <th className="px-4 py-3 font-bold">Amount</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="rounded-r-xl px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soil-100">
                {recentOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-soil-50/50 transition-colors">
                    <td className="px-4 py-4 font-black text-soil-900">#{order.order_id}</td>
                    <td className="px-4 py-4 font-semibold text-soil-600">{order.customer_id}</td>
                    <td className="px-4 py-4 text-soil-600">
                      <span className="truncate block max-w-[200px]">
                        {order.items.map(i => i.product_name).join(', ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-black text-[#2d6f35]">₹{order.total_amount.toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[order.order_status] || 'bg-soil-100 text-soil-700'}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link to={`/admin/orders?view=${order.order_id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-soil-100 text-soil-600 hover:bg-[#055205] hover:text-white transition-colors">
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <div className="py-10 text-center text-sm font-bold text-soil-500">
                No recent orders found.
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Performing Items */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="col-span-1 rounded-3xl border border-soil-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-soil-900">Top Performing Items</h2>
          </div>
          <div className="space-y-6">
            {summary?.top_performing_items?.map((item, idx) => (
              <div key={item.product_id} className="flex items-center gap-4">
                <span className="text-soil-400 font-bold text-sm w-4">#{idx + 1}</span>
                <div className="w-12 h-12 rounded-[14px] overflow-hidden bg-soil-100 shrink-0 border border-soil-200">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaBoxOpen className="w-full h-full p-2.5 text-soil-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-soil-900 truncate">{item.name}</p>
                  <p className="text-xs font-medium text-soil-500 mt-0.5">{item.units_sold} units sold</p>
                </div>
                <p className="font-black text-sm text-[#055205]">₹{item.revenue.toFixed(2)}</p>
              </div>
            ))}
            {(!summary?.top_performing_items || summary.top_performing_items.length === 0) && (
              <div className="py-10 text-center text-sm font-bold text-soil-500">
                Not enough sales data yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
