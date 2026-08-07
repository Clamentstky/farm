import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaHome, FaLayerGroup, FaBoxOpen, FaClipboardList, 
  FaUsers, FaTruck, FaChartBar, FaCog, FaSignOutAlt, FaBars, FaBell, FaSearch 
} from 'react-icons/fa'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useToast } from '../../context/ToastContext'
import { getProducts } from '../../api/catalog'

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
  { name: 'Categories', path: '/admin/categories', icon: FaLayerGroup },
  { name: 'Products', path: '/admin/products', icon: FaBoxOpen },
  { name: 'Orders', path: '/admin/orders', icon: FaClipboardList },
  { name: 'Customers', path: '/admin/customers', icon: FaUsers },
  { name: 'Deliveries', path: '/admin/delivery', icon: FaTruck },
  { name: 'Reports', path: '/admin/reports', icon: FaChartBar },
  { name: 'Settings', path: '/admin/settings', icon: FaCog },
]

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const { showToast } = useToast()
  
  const [lowStockAlerts, setLowStockAlerts] = useState([])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const products = await getProducts()
        const lowStock = products.filter(p => p.stock < 10)
        setLowStockAlerts(lowStock)
      } catch (err) {
        console.error('Failed to fetch low stock products:', err)
      }
    }
    fetchAlerts()
  }, [])

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      showToast('Global search is coming soon!', 'info')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white">
      {/* Brand */}
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-soil-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#055205] text-xl text-white shadow-md">
          🌾
        </div>
        {(isSidebarOpen || isMobileMenuOpen) && (
          <div className="flex flex-col">
            <span className="text-lg font-black text-soil-900 leading-none tracking-tight">FarmNest</span>
            <span className="text-[10px] font-bold text-leaf-600 uppercase tracking-wider mt-0.5">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                isActive
                  ? 'bg-leaf-50 text-[#055205] shadow-sm shadow-leaf-100/50'
                  : 'text-soil-600 hover:bg-soil-50 hover:text-soil-900'
              }`
            }
          >
            <item.icon className="text-lg shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer Profile */}
      <div className="border-t border-soil-100 p-4">
        <div 
          onClick={() => { navigate('/admin/profile'); setIsMobileMenuOpen(false) }}
          className={`flex items-center gap-3 rounded-xl bg-soil-50 p-3 cursor-pointer transition-colors hover:bg-soil-100 ${!isSidebarOpen && !isMobileMenuOpen ? 'justify-center' : ''}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#055205] font-black text-white">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          {(isSidebarOpen || isMobileMenuOpen) && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold text-soil-900">{admin?.name}</p>
              <p className="truncate text-xs font-semibold text-soil-500 capitalize">{admin?.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 ${
            !isSidebarOpen && !isMobileMenuOpen ? 'justify-center' : ''
          }`}
        >
          <FaSignOutAlt className="text-lg shrink-0" />
          {(isSidebarOpen || isMobileMenuOpen) && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#f4f7f4] font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="hidden border-r border-soil-200 bg-white shadow-xl shadow-soil-200/20 lg:block z-20 shrink-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-soil-900/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navbar */}
        <header className="relative flex h-20 shrink-0 items-center justify-between border-b border-soil-200 bg-white/80 px-4 backdrop-blur-xl lg:px-8 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-soil-50 text-soil-600 lg:hidden hover:bg-soil-100"
            >
              <FaBars />
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden h-10 w-10 items-center justify-center rounded-xl bg-soil-50 text-soil-600 lg:flex hover:bg-soil-100"
            >
              <FaBars />
            </button>
            
            <div className="flex flex-col lg:hidden">
              <span className="text-lg font-black text-soil-900 leading-none tracking-tight">FarmNest</span>
              <span className="text-[10px] font-bold text-leaf-600 uppercase tracking-wider mt-0.5">Admin Portal</span>
            </div>

            <div className="hidden items-center md:flex relative ml-4">
              <FaSearch className="absolute left-3 text-soil-400" />
              <input 
                type="text" 
                placeholder="Search anything... (Press Enter)" 
                onKeyDown={handleSearch}
                className="h-10 w-64 rounded-full border border-soil-200 bg-soil-50 pl-10 pr-4 text-sm font-semibold text-soil-900 focus:border-leaf-500 focus:outline-none focus:ring-1 focus:ring-leaf-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsProfileOpen(false) }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-soil-50 text-soil-600 hover:bg-soil-100 transition-colors"
              >
                <FaBell />
                {lowStockAlerts.length > 0 && (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                )}
              </button>
              
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute -right-14 sm:right-0 mt-2 w-80 rounded-3xl bg-white p-4 shadow-xl border border-soil-100 z-50 max-h-96 flex flex-col"
                  >
                    <div className="flex items-center justify-between border-b border-soil-100 pb-3 mb-3 shrink-0">
                      <h3 className="text-sm font-black text-soil-900">Notifications</h3>
                      {lowStockAlerts.length > 0 && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                          {lowStockAlerts.length} New
                        </span>
                      )}
                    </div>
                    
                    <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
                      {lowStockAlerts.length === 0 ? (
                        <div className="py-8 text-center flex flex-col items-center">
                          <span className="text-2xl mb-2">🎉</span>
                          <p className="text-xs font-bold text-soil-500">All caught up!</p>
                          <p className="text-[10px] text-soil-400 mt-1">No new notifications</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {lowStockAlerts.map(product => (
                            <div key={product.id} className="flex gap-3 rounded-2xl bg-orange-50/50 p-3 border border-orange-100/50 transition-colors hover:bg-orange-50">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                ⚠️
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-soil-800 truncate">{product.name}</p>
                                <p className="text-[10px] font-semibold text-orange-600 mt-0.5">
                                  Low Stock: Only {product.stock} {product.unit} left
                                </p>
                              </div>
                              <button 
                                onClick={() => navigate('/admin/products')}
                                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 shrink-0 self-center"
                              >
                                Restock
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button 
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationOpen(false) }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#055205] font-black text-white border-2 border-white shadow-sm shadow-[#055205]/30 hover:ring-2 hover:ring-leaf-500 transition-all cursor-pointer"
              >
                {admin?.name?.charAt(0) || 'A'}
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl border border-soil-100 z-50"
                  >
                    <div className="px-4 py-2 border-b border-soil-100 mb-2">
                      <p className="text-sm font-black text-soil-900 truncate">{admin?.name}</p>
                      <p className="text-xs font-semibold text-soil-500 capitalize">{admin?.role}</p>
                    </div>
                    <button onClick={() => { setIsProfileOpen(false); navigate('/admin/profile') }} className="w-full text-left px-4 py-2 text-sm font-bold text-soil-700 hover:bg-soil-50 rounded-xl">
                      My Profile
                    </button>
                    <button onClick={() => { setIsProfileOpen(false); navigate('/admin/settings') }} className="w-full text-left px-4 py-2 text-sm font-bold text-soil-700 hover:bg-soil-50 rounded-xl mt-1">
                      Settings
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl mt-1">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f4f7f4]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
