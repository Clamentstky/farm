import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import RegistrationSuccess from './pages/RegistrationSuccess'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import CategoryProducts from './pages/CategoryProducts'
import CartPage from './pages/CartPage'
import ProductDetails from './pages/ProductDetails'
import CheckoutPage from './pages/CheckoutPage'
import CheckoutSuccess from './pages/CheckoutSuccess'
import MyOrders from './pages/MyOrders'
import OrderDetails from './pages/OrderDetails'
import NotFound from './pages/NotFound'
import ProtectedRoute from './routes/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminRoute from './components/admin/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCategories from './pages/admin/AdminCategories'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminDelivery from './pages/admin/AdminDelivery'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'
import AdminProfile from './pages/admin/AdminProfile'

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="delivery" element={<AdminDelivery />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/:id"
          element={
            <ProtectedRoute>
              <CategoryProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/success"
          element={
            <ProtectedRoute>
              <CheckoutSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route path="/orders" element={<Navigate to="/my-orders" replace />} />
        <Route
          path="/my-orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
