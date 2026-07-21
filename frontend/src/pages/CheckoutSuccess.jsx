import { Link, Navigate, useLocation } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import PrimaryButton from '../components/PrimaryButton'
import SiteFooter from '../components/SiteFooter'
import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'

export default function CheckoutSuccess() {
  const location = useLocation()
  const address = location.state?.address
  const paymentMethod = location.state?.paymentMethod || 'Cash on Delivery'

  if (!address) {
    return <Navigate to="/cart" replace />
  }

  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

  return (
    <div className="min-h-screen bg-soil-50 text-soil-700">
      <header className="border-b border-soil-100 bg-white/95 shadow-sm shadow-soil-100/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/customer/dashboard" className="flex items-center gap-3">
            <BrandIcon className="h-10 w-10" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">{BRAND_NAME}</p>
              <h1 className="font-display text-lg font-semibold text-soil-700">{BRAND_TAGLINE}</h1>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-full bg-leaf-100 p-4 text-leaf-700">
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m5 12 4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-leaf-600">Step 3 of 3</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-soil-700">Order placed successfully</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-soil-500">
          Your farm order is confirmed. We will prepare it for delivery and send updates shortly.
        </p>

        <div className="mt-6 w-full rounded-2xl border border-soil-100 bg-white p-6 text-left shadow-sm">
          <p className="text-sm font-semibold text-soil-600">Order number</p>
          <p className="mt-1 text-lg font-bold text-soil-700">{orderNumber}</p>
          <p className="mt-4 text-sm font-semibold text-soil-600">Payment method</p>
          <p className="mt-1 text-sm text-soil-700">{paymentMethod}</p>
          <p className="mt-4 text-sm font-semibold text-soil-600">Delivery address</p>
          <p className="mt-1 text-sm text-soil-700">{address.fullName}, {address.address}, {address.city} - {address.pincode}</p>
        </div>

        <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
          <Link to="/customer/dashboard">
            <PrimaryButton>Continue shopping</PrimaryButton>
          </Link>
          <Link to="/cart" className="text-center text-sm font-bold text-soil-600">
            View cart
          </Link>
        </div>
      </main>

      <SiteFooter compact />
    </div>
  )
}
