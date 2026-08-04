import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandIcon from '../BrandIcon'
import CartButton from '../CartButton'
import CustomerProfilePanel from '../CustomerProfilePanel'
import { BRAND_NAME, BRAND_TAGLINE } from '../../data/brand'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function OrdersTopBar() {
  const { customer, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  
  const avatarLetter = customer?.full_name?.charAt(0)?.toUpperCase() || BRAND_NAME.charAt(0)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 bg-[#2d6f35] px-4 py-4 text-white shadow-md lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/customer/dashboard" className="flex min-w-0 items-center gap-3">
          <BrandIcon className="h-12 w-12 rounded-xl" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-xl font-extrabold text-white">{BRAND_NAME}</span>
            <span className="block text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/75">
              {BRAND_TAGLINE}
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="hidden rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex"
          >
            Logout
          </button>
          <CartButton count={cartCount} to="/cart" />
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff3bd] text-lg font-black text-[#2d6f35]"
            aria-label="Open profile"
          >
            {avatarLetter}
          </button>
        </div>
      </div>

      <CustomerProfilePanel 
        open={profileOpen} 
        onClose={() => setProfileOpen(false)} 
        customer={customer} 
        onLogout={handleLogout} 
      />
    </header>
  )
}
