import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaDownload, FaFilePdf, FaFileExcel, FaFileCsv, FaChartLine, 
  FaChartPie, FaChartBar, FaCalendarAlt, FaFilter, FaUsers,
  FaBoxOpen, FaCheckCircle, FaClock, FaMapMarkerAlt, FaSearch,
  FaPrint, FaChevronRight, FaExclamationCircle, FaTimesCircle
} from 'react-icons/fa'
import { BiRupee } from 'react-icons/bi'

import api from '../../api/client'
import { useToast } from '../../context/ToastContext'

export default function AdminReports() {
  const [dateRange, setDateRange] = useState('Today')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Table state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { showToast } = useToast()

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/api/admin/reports/analytics')
      setAnalytics(res.data)
    } catch (error) {
      showToast('Failed to load analytics', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  // --- EXPORT HANDLERS ---
  const handleDownloadCSV = () => {
    const dataToExport = analytics?.table_data || []
    if (dataToExport.length === 0) {
      showToast('No data to export', 'error')
      return
    }
    
    const headers = ['Order ID', 'Customer', 'Village', 'Date', 'Payment Method', 'Revenue', 'Status']
    const csvRows = [headers.join(',')]
    
    dataToExport.forEach(row => {
      const values = [
        row.id,
        `"${row.customer}"`,
        `"${row.village}"`,
        `"${row.date}"`,
        `"${row.method}"`,
        row.revenue,
        row.status
      ]
      csvRows.push(values.join(','))
    })
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Farm_Report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showToast('Report downloaded successfully!', 'success')
  }

  const handlePrint = () => {
    window.print()
  }

  // --- DATA FROM API ---
  const villageData = analytics?.village_data || []
  const maxVillageOrders = Math.max(...villageData.map(v => v.orders), 1)

  const recentActivities = analytics?.recent_activities || []

  // --- FILTER & PAGINATION LOGIC ---
  const tableData = analytics?.table_data || []
  
  const filteredTableData = tableData.filter(row => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      row.customer.toLowerCase().includes(searchLower) ||
      row.id.toLowerCase().includes(searchLower) ||
      row.village.toLowerCase().includes(searchLower)
      
    const matchesFilter = filterStatus === 'All' || row.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredTableData.length / itemsPerPage)
  const currentTableData = filteredTableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus])

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
      case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
      case 'Processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
      case 'Cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  if (loading) {
    return (
      <div className="p-10 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-soil-200 dark:bg-soil-800 rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-32 bg-soil-200 dark:bg-soil-800 rounded-3xl"></div>)}
        </div>
      </div>
    )
  }

  const kpis = [
    { title: "Today's Revenue", value: `₹${Number(analytics?.kpis?.todays_revenue || 0).toFixed(2)}`, trend: '+12%', icon: BiRupee, gradient: 'from-emerald-500 to-teal-400' },
    { title: 'Monthly Revenue', value: `₹${Number(analytics?.kpis?.total_revenue || 0).toFixed(2)}`, trend: '+14%', icon: FaChartLine, gradient: 'from-blue-500 to-indigo-500' },
    { title: 'Total Orders', value: analytics?.kpis?.total_orders || 0, trend: '+5%', icon: FaBoxOpen, gradient: 'from-indigo-500 to-purple-500' },
    { title: 'Pending Orders', value: analytics?.kpis?.pending_orders || 0, trend: '-2%', icon: FaClock, gradient: 'from-amber-500 to-orange-400' },
    { title: 'Delivered Orders', value: analytics?.kpis?.delivered_orders || 0, trend: '+8%', icon: FaCheckCircle, gradient: 'from-green-500 to-emerald-500' },
    { title: 'New Customers', value: analytics?.kpis?.total_customers || 0, trend: '+18%', icon: FaUsers, gradient: 'from-pink-500 to-rose-400' },
    { title: 'Avg. Order Value', value: `₹${Number(analytics?.kpis?.avg_order_value || 0).toFixed(2)}`, trend: '+2%', icon: FaChartPie, gradient: 'from-violet-500 to-fuchsia-500' },
    { title: 'Products Sold', value: '1,248', trend: '+24%', icon: FaChartBar, gradient: 'from-cyan-500 to-blue-500' }
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={container} className="space-y-6 max-w-[1600px] mx-auto pb-12">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-soil-900 p-6 rounded-3xl border border-soil-100 dark:border-soil-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-soil-900 dark:text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-sm font-medium text-soil-500 dark:text-soil-400 mt-1">Detailed enterprise insights into farm performance</p>
        </div>
        <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative w-[55%] sm:w-auto">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select 
              value={dateRange} onChange={(e) => setDateRange(e.target.value)}
              className="pl-9 pr-6 py-2.5 w-full rounded-xl border border-soil-200 bg-soil-50 dark:bg-soil-800 dark:border-soil-700 text-sm font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none shadow-sm transition-shadow hover:shadow-md"
            >
              <option>Today</option><option>This Week</option><option>This Month</option><option>Last 3 Months</option><option>This Year</option>
            </select>
          </div>
          <div className="relative group w-[45%] sm:w-auto print:hidden">
            <button className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-soil-900 dark:bg-white px-3 py-2.5 text-sm font-bold text-white dark:text-soil-900 hover:opacity-90 shadow-lg transition-all">
              <FaDownload /> Export
            </button>
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-soil-800 shadow-2xl border border-soil-100 dark:border-soil-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 transform origin-top-right scale-95 group-hover:scale-100 print:hidden">
              <button onClick={handlePrint} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-soil-50 dark:hover:bg-soil-700 rounded-t-2xl"><FaFilePdf className="text-red-500" /> Export to PDF</button>
              <button onClick={handleDownloadCSV} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-soil-50 dark:hover:bg-soil-700"><FaFileExcel className="text-green-600" /> Export to Excel</button>
              <button onClick={handleDownloadCSV} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-soil-50 dark:hover:bg-soil-700"><FaFileCsv className="text-blue-500" /> Download CSV</button>
              <div className="border-t border-soil-100 dark:border-soil-700"></div>
              <button onClick={handlePrint} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-soil-50 dark:hover:bg-soil-700 rounded-b-2xl"><FaPrint className="text-gray-500" /> Print Report</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- TOP SUMMARY CARDS (8 Grid) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          const isPositive = kpi.trend.startsWith('+')
          return (
            <motion.div key={idx} variants={item} className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-soil-900 p-2.5 sm:p-6 shadow-sm border border-soil-100 dark:border-soil-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative z-10 flex flex-row items-center justify-between gap-1 sm:gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-sm font-bold text-soil-500 dark:text-soil-400 whitespace-nowrap tracking-tight">{kpi.title}</p>
                  <p className="mt-0.5 sm:mt-2 text-base sm:text-3xl font-black text-soil-900 dark:text-white tracking-tight truncate">{kpi.value}</p>
                  <div className="mt-1 sm:mt-3 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    <span className={`inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${isPositive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                      {kpi.trend}
                    </span>
                    <span className="text-[9px] sm:text-xs font-semibold text-soil-400 truncate hidden sm:inline">vs last period</span>
                  </div>
                </div>
                <div className={`flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-2xl bg-gradient-to-br ${kpi.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="text-sm sm:text-xl" />
                </div>
              </div>
              {/* Decorative background glow */}
              <div className={`absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-br ${kpi.gradient} opacity-[0.08] dark:opacity-[0.15] group-hover:opacity-[0.15] transition-opacity duration-300 blur-2xl`} />
            </motion.div>
          )
        })}
      </div>

      {/* --- WIDGETS ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Distribution */}
        <motion.div variants={item} className="rounded-3xl bg-white dark:bg-soil-900 p-6 border border-soil-100 dark:border-soil-800 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h2 className="text-lg font-black text-soil-900 dark:text-white tracking-tight">Sales by Category</h2>
            <p className="text-xs font-semibold text-soil-500 dark:text-soil-400">Revenue distribution</p>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="w-full h-6 flex rounded-full overflow-hidden shadow-inner bg-soil-50 dark:bg-soil-800">
              {analytics?.category_data?.map((cat, idx) => (
                <motion.div key={idx} initial={{ width: 0 }} animate={{ width: `${cat.value}%` }} transition={{ duration: 1, delay: 0.2 }} className={`${cat.color} hover:brightness-110 transition-all cursor-pointer`} title={`${cat.name}: ${cat.value}%`}></motion.div>
              ))}
            </div>
            
            <div className="space-y-4">
              {analytics?.category_data?.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-soil-50 dark:hover:bg-soil-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-md ${cat.color} shadow-sm group-hover:scale-110 transition-transform`}></div>
                    <span className="text-sm font-bold text-soil-700 dark:text-soil-300">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-soil-400">₹{Math.floor((analytics?.kpis?.total_revenue || 0) * (cat.value/100))}</span>
                    <span className="text-sm font-black text-soil-900 dark:text-white w-10 text-right">{cat.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Village Orders (Horizontal Bars) */}
        <motion.div variants={item} className="rounded-3xl bg-white dark:bg-soil-900 p-6 border border-soil-100 dark:border-soil-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-soil-900 dark:text-white tracking-tight">Orders by Village</h2>
              <p className="text-xs font-semibold text-soil-500 dark:text-soil-400">Top performing delivery zones</p>
            </div>
            <div className="p-2 rounded-xl bg-soil-50 dark:bg-soil-800 text-soil-400"><FaMapMarkerAlt /></div>
          </div>

          <div className="space-y-5 mt-6">
            {villageData.map((village, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span className="text-soil-700 dark:text-soil-300">{village.name}</span>
                  <span className="text-soil-900 dark:text-white">{village.orders} <span className="text-soil-400 font-semibold text-xs ml-1">orders</span></span>
                </div>
                <div className="w-full h-2.5 bg-soil-100 dark:bg-soil-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${(village.orders / maxVillageOrders) * 100}%` }} transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${village.color}`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities Feed */}
        <motion.div variants={item} className="rounded-3xl bg-white dark:bg-soil-900 p-6 border border-soil-100 dark:border-soil-800 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-black text-soil-900 dark:text-white tracking-tight">Recent Activity</h2>
              <p className="text-xs font-semibold text-soil-500 dark:text-soil-400">Latest business events</p>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View All</button>
          </div>

          <div className="flex-1 relative overflow-y-auto pr-2 -mr-2 hide-scrollbar space-y-6">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-soil-100 dark:bg-soil-800 z-0"></div>
            
            {recentActivities.map((activity, idx) => {
              // Map the string icon back to a component if needed, or just use FaBoxOpen as fallback
              let Icon = FaBoxOpen
              if (activity.icon === 'FaCheckCircle') Icon = FaCheckCircle
              else if (activity.icon === 'FaUsers') Icon = FaUsers
              else if (activity.icon === 'FaExclamationCircle') Icon = FaExclamationCircle
              else if (activity.icon === 'FaTimesCircle') Icon = FaTimesCircle
              
              return (
                <div key={activity.id} className="relative z-10 flex gap-4 group cursor-pointer">
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-white dark:bg-soil-900 border-2 border-soil-50 dark:border-soil-800 shadow-sm group-hover:scale-110 group-hover:border-${activity.color}-100 transition-all`}>
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center bg-${activity.color}-50 dark:bg-${activity.color}-500/10 text-${activity.color}-500`}>
                      <Icon size={12} />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm font-bold text-soil-700 dark:text-soil-300 group-hover:text-soil-900 dark:group-hover:text-white transition-colors">{activity.text}</p>
                    <p className="text-xs font-semibold text-soil-400 mt-1">{activity.time}</p>
                  </div>
                  <div className="pt-2">
                    <FaChevronRight className="text-soil-300 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" size={12}/>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* --- FULL DATA TABLE --- */}
      <motion.div variants={item} className="rounded-3xl bg-white dark:bg-soil-900 border border-soil-100 dark:border-soil-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-soil-100 dark:border-soil-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-soil-900 dark:text-white tracking-tight">Detailed Reports Table</h2>
            <p className="text-xs font-semibold text-soil-500 dark:text-soil-400">Comprehensive view of all transactions</p>
          </div>
          <div className="flex gap-3 relative">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-400" size={14}/>
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-xl border border-soil-200 bg-soil-50 dark:bg-soil-800 dark:border-soil-700 text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2 rounded-xl border ${filterStatus !== 'All' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-soil-200 bg-soil-50 dark:bg-soil-800 dark:border-soil-700 text-soil-500'} hover:bg-soil-100 transition-colors`}
              >
                <FaFilter size={14}/>
              </button>
              
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 rounded-xl bg-white dark:bg-soil-800 shadow-xl border border-soil-100 dark:border-soil-700 z-50 overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map(status => (
                        <button 
                          key={status}
                          onClick={() => { setFilterStatus(status); setIsFilterOpen(false) }}
                          className={`w-full text-left px-3 py-2 text-sm font-bold rounded-lg transition-colors ${filterStatus === status ? 'bg-indigo-50 text-indigo-600' : 'text-soil-700 dark:text-soil-300 hover:bg-soil-50 dark:hover:bg-soil-700'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-soil-50/50 dark:bg-soil-800/50 text-soil-500 dark:text-soil-400 border-b border-soil-100 dark:border-soil-800">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Order ID</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Customer & Village</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Payment</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Revenue</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soil-100 dark:divide-soil-800">
              {currentTableData.length > 0 ? currentTableData.map((row) => (
                <tr key={row.id} className="hover:bg-soil-50 dark:hover:bg-soil-800/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">{row.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-soil-900 dark:text-white">{row.customer}</p>
                    <p className="text-xs font-semibold text-soil-400">{row.village}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-soil-600 dark:text-soil-400">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 font-bold text-soil-700 dark:text-soil-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-soil-300"></span>{row.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-soil-900 dark:text-white">₹{row.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/admin/orders?view=${row.id}`} className="text-indigo-500 hover:text-indigo-700 font-bold text-xs transition-colors">View Details</Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm font-bold text-soil-400">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-soil-100 dark:border-soil-800 flex items-center justify-between bg-soil-50/30 dark:bg-soil-800/30">
          <span className="text-xs font-semibold text-soil-500">
            Showing {filteredTableData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredTableData.length)} of {filteredTableData.length} entries
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                currentPage === 1 
                  ? 'border-soil-200 bg-white dark:bg-soil-800 text-soil-400 cursor-not-allowed' 
                  : 'border-soil-300 bg-white dark:bg-soil-700 text-soil-700 hover:bg-soil-50'
              }`}
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm ${
                currentPage === totalPages || totalPages === 0
                  ? 'bg-indigo-400 text-white cursor-not-allowed opacity-50'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

    </motion.div>
  )
}
