import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandIcon from '../components/BrandIcon'
import PrimaryButton from '../components/PrimaryButton'
import SiteFooter from '../components/SiteFooter'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../api/address'
import { placeOrder } from '../api/order'
import { extractErrorMessage } from '../api/client'
import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'

const TAMIL_NADU_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
  'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
  'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
  'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
  'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
]

const emptyForm = {
  full_name: '',
  mobile_number: '',
  address: '',
  village: '',
  district: '',
  state: '',
  pincode: '',
  landmark: '',
  is_default: false,
}

const PAYMENT_METHODS = [
  {
    id: 'Cash on Delivery',
    label: 'Cash on Delivery',
    desc: 'Pay with cash or UPI upon delivery at your doorstep.',
    badge: 'Popular',
    features: ['Pay on arrival', 'Cash or UPI accepted', 'Zero extra fees'],
    icon: (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-2xs">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  },
  {
    id: 'Online Payment',
    label: 'Online Payment',
    desc: 'Pay via UPI, Cards, or Net Banking.',
    icon: (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-2xs">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    ),
  },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { customer } = useAuth()
  const { cartItems, cartCount, cartTotal, loading: cartLoading, refreshCart, clearCart } = useCart()

  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState(emptyForm)
  const [addressError, setAddressError] = useState('')
  const [savingAddress, setSavingAddress] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [addressesLoading, setAddressesLoading] = useState(false)

  const deliveryCharge = 0 // cartTotal > 0 && cartTotal < 100 ? 40 : 0
  const discount = 0
  const grandTotal = cartTotal + deliveryCharge - discount

  const loadAddresses = useCallback(async () => {
    setAddressesLoading(true)
    try {
      const data = await getAddresses()
      setAddresses(data)
      const defaultAddr = data.find((a) => a.is_default)
      if (defaultAddr && !selectedAddressId) {
        setSelectedAddressId(defaultAddr.id)
      } else if (data.length > 0 && !selectedAddressId) {
        setSelectedAddressId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to load addresses:', err)
    } finally {
      setAddressesLoading(false)
    }
  }, [selectedAddressId])

  useEffect(() => {
    if (customer) {
      loadAddresses()
    }
  }, [customer])

  useEffect(() => {
    if (cartItems.length === 0 && !cartLoading) {
      refreshCart()
    }
  }, [])

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId)

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddressForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const openAddForm = () => {
    setEditingAddress(null)
    setAddressForm(emptyForm)
    setAddressError('')
    setShowAddressForm(true)
  }

  const openEditForm = (address) => {
    setEditingAddress(address)
    setAddressForm({
      full_name: address.full_name || '',
      mobile_number: address.mobile_number || '',
      address: address.address || '',
      village: address.village || '',
      district: address.district || '',
      state: address.state || '',
      pincode: address.pincode || '',
      landmark: address.landmark || '',
      is_default: address.is_default || false,
    })
    setAddressError('')
    setShowAddressForm(true)
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    setSavingAddress(true)
    setAddressError('')
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressForm)
      } else {
        await addAddress(addressForm)
      }
      setShowAddressForm(false)
      setEditingAddress(null)
      setAddressForm(emptyForm)
      await loadAddresses()
    } catch (err) {
      setAddressError(extractErrorMessage(err))
    } finally {
      setSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return
    try {
      await deleteAddress(addressId)
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null)
      }
      await loadAddresses()
    } catch (err) {
      setAddressError(extractErrorMessage(err))
    }
  }

  const handleSetDefault = async (address) => {
    try {
      await updateAddress(address.id, { is_default: true })
      await loadAddresses()
    } catch (err) {
      setAddressError(extractErrorMessage(err))
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setOrderError('Please select a delivery address')
      return
    }
    setPlacingOrder(true)
    setOrderError('')
    try {
      const order = await placeOrder({
        address_id: selectedAddressId,
        payment_method: paymentMethod,
        delivery_charge: deliveryCharge,
        discount: discount,
      })
      await refreshCart()
      navigate('/checkout/success', {
        state: {
          orderId: order.order_id,
          orderDate: order.created_at,
          address: selectedAddress,
          paymentMethod: order.payment_method,
          orderStatus: order.order_status,
          totalAmount: order.total_amount,
        },
      })
    } catch (err) {
      setOrderError(extractErrorMessage(err))
    } finally {
      setPlacingOrder(false)
    }
  }

  if (cartLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-soil-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-leaf-500 border-t-transparent" />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-soil-50 text-soil-700">
        <header className="border-b border-soil-100 bg-white/95 shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link to="/customer/dashboard" className="flex items-center gap-3">
              <BrandIcon className="h-10 w-10" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">{BRAND_NAME}</p>
                <h1 className="font-display text-lg font-semibold text-soil-700">{BRAND_TAGLINE}</h1>
              </div>
            </Link>
          </div>
        </header>
        <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
          <div className="rounded-full bg-soil-100 p-6 text-soil-400">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <h2 className="mt-6 font-display text-2xl font-semibold text-soil-700">Your cart is empty</h2>
          <p className="mt-2 text-sm text-soil-500">Add some fresh farm products to get started.</p>
          <Link to="/customer/dashboard" className="mt-6">
            <PrimaryButton>Browse Products</PrimaryButton>
          </Link>
        </main>
        <SiteFooter compact />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soil-50 text-soil-700">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-soil-100 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/customer/dashboard" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <BrandIcon className="h-8 w-8 sm:h-10 sm:w-10 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-leaf-600 truncate">{BRAND_NAME}</p>
              <h1 className="font-display text-xs sm:text-lg font-semibold text-soil-700 truncate">{BRAND_TAGLINE}</h1>
            </div>
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-1.5 rounded-full border border-leaf-500/30 bg-leaf-50 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold text-leaf-700 transition hover:bg-leaf-100 shrink-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Cart
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf-600">Checkout</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-soil-800 sm:text-3xl">
            Review & place your order
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Left Column - Delivery Address & Payment */}
          <div className="space-y-6">
            {/* Delivery Address Section */}
            <section className="rounded-3xl border border-soil-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-soil-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100 text-xs font-bold text-leaf-700">
                    1
                  </div>
                  <h3 className="font-display text-xl font-bold text-soil-800">Delivery Address</h3>
                </div>

                <button
                  type="button"
                  onClick={openAddForm}
                  className="inline-flex items-center gap-1 rounded-xl bg-leaf-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-leaf-700 active:scale-95"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add New
                </button>
              </div>

              {addressError && (
                <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
                  {addressError}
                </div>
              )}

              {addressesLoading ? (
                <div className="mt-4 flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-leaf-500 border-t-transparent" />
                </div>
              ) : addresses.length === 0 && !showAddressForm ? (
                <div className="mt-4 rounded-2xl border-2 border-dashed border-soil-200 p-8 text-center bg-soil-50/50">
                  <p className="text-sm font-semibold text-soil-600">No saved addresses found.</p>
                  <p className="mt-1 text-xs text-soil-400">Please add a delivery address to complete your order.</p>
                  <button
                    type="button"
                    onClick={openAddForm}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-leaf-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-leaf-700"
                  >
                    + Add Delivery Address
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`group relative rounded-2xl border-2 p-4 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-leaf-500 bg-leaf-50/50 shadow-sm'
                            : 'border-soil-200/80 bg-white hover:border-soil-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                          <div className="flex items-start gap-3 min-w-0 w-full sm:w-auto">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={isSelected}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="mt-1 h-4 w-4 shrink-0 text-leaf-600 focus:ring-leaf-500"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-soil-800 text-sm sm:text-base">
                                  {addr.full_name}
                                </span>
                                {addr.is_default && (
                                  <span className="rounded-full border border-leaf-300 bg-leaf-100/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-leaf-800">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs font-medium text-soil-600 leading-relaxed sm:text-sm">
                                {addr.address}, {addr.village}
                              </p>
                              <p className="text-xs font-medium text-soil-600 sm:text-sm">
                                {addr.district}, {addr.state} - <span className="font-bold text-soil-800">{addr.pincode}</span>
                              </p>
                              <p className="mt-1 text-xs font-semibold text-soil-500">
                                📞 {addr.mobile_number}
                              </p>
                              {addr.landmark && (
                                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-800 shadow-sm">
                                  <svg className="h-3 w-3 shrink-0 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  Landmark: {addr.landmark}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Address Action Buttons */}
                          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-1.5 shrink-0 pl-7 sm:pl-0 pt-2 sm:pt-0 border-t border-soil-100 sm:border-0 mt-2 sm:mt-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                openEditForm(addr)
                              }}
                              className="inline-flex items-center gap-1 rounded-xl border border-leaf-200 bg-leaf-50 px-2.5 py-1 text-[11px] font-bold text-leaf-700 transition hover:bg-leaf-100 hover:border-leaf-300 active:scale-95"
                            >
                              <svg className="h-3 w-3 text-leaf-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Edit
                            </button>

                            {!addr.is_default && (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSetDefault(addr)
                                  }}
                                  className="inline-flex items-center gap-1 rounded-xl border border-soil-200 bg-soil-50 px-2.5 py-1 text-[11px] font-bold text-soil-600 transition hover:bg-soil-100 hover:text-soil-800 active:scale-95"
                                >
                                  Set Default
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteAddress(addr.id)
                                  }}
                                  className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 transition hover:bg-red-100 hover:border-red-300 active:scale-95"
                                >
                                  <svg className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Payment Method Section */}
            <section className="rounded-3xl border border-soil-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between border-b border-soil-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#118707] text-xs font-extrabold text-white shadow-xs ring-4 ring-leaf-100">
                    2
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-soil-800">Payment Method</h3>
                    <p className="text-xs text-soil-500">Choose your preferred mode of payment</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3.5">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = paymentMethod === method.id
                  return (
                    <label
                      key={method.id}
                      className={`relative flex items-start gap-3.5 rounded-2xl border-2 p-4 transition sm:p-5 ${
                        method.disabled
                          ? 'opacity-70 border-soil-200 bg-soil-50/70 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#118707] bg-gradient-to-r from-emerald-50/90 via-white to-green-50/40 shadow-sm ring-2 ring-[#118707]/15 cursor-pointer'
                          : 'border-soil-200 bg-white hover:border-soil-300 cursor-pointer'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        disabled={method.disabled}
                        checked={isSelected}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1.5 h-4 w-4 shrink-0 text-[#118707] focus:ring-[#118707]"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {method.icon}
                            <div>
                              <span className="font-bold text-soil-800 text-base sm:text-lg block leading-snug">
                                {method.label}
                              </span>
                              <p className="text-xs text-soil-500 leading-relaxed mt-0.5">
                                {method.desc}
                              </p>
                            </div>
                          </div>

                          {method.badge && (
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-2xs ${
                                method.disabled
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-[#118707] text-white'
                              }`}
                            >
                              {method.badge}
                            </span>
                          )}
                        </div>

                        {method.features && isSelected && (
                          <div className="mt-3 flex flex-wrap gap-2 border-t border-emerald-100 pt-3 text-[11px] font-bold text-emerald-800">
                            {method.features.map((feat) => (
                              <span key={feat} className="inline-flex items-center gap-1 rounded-md bg-emerald-100/80 px-2 py-0.5">
                                ✓ {feat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <aside className="space-y-5">
            <section className="rounded-3xl border border-soil-100 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-display text-xl font-bold text-soil-800 border-b border-soil-100 pb-3">
                Order Summary
              </h3>

              {/* Delivery Progress Bar (Removed) */}
              
              <div className="mt-4 space-y-4">
                {/* Cart Items List */}
                <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-soil-50/80 p-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-leaf-600 text-xs font-bold text-white shadow-2xs">
                          {item.quantity}×
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-soil-800 sm:text-sm">
                            {item.product_name}
                          </p>
                          {item.unit && (
                            <p className="text-[11px] text-soil-400">{item.unit}</p>
                          )}
                        </div>
                      </div>

                      <span className="font-bold text-soil-800 text-xs sm:text-sm shrink-0">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 border-t border-soil-100 pt-4 text-xs sm:text-sm">
                  <div className="flex justify-between text-soil-600">
                    <span>Items ({cartCount})</span>
                    <span className="font-semibold text-soil-800">₹{cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-soil-600 items-center">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-soil-800">₹{deliveryCharge.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount</span>
                      <span>- ₹{discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-soil-100 pt-3 text-base font-bold text-soil-800">
                    <span>Grand Total</span>
                    <span className="font-display text-xl text-leaf-700">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </section>

            {orderError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600">
                {orderError}
              </div>
            )}

            {/* Place Order CTA Button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
              className="w-full rounded-2xl bg-leaf-600 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-leaf-600/30 transition hover:bg-leaf-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placingOrder ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Placing Order...
                </span>
              ) : (
                'Place Order'
              )}
            </button>

            <p className="text-center text-[11px] font-medium text-soil-400 leading-relaxed">
              By placing this order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </aside>
        </div>
      </main>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl animate-scale-up">
            <div className="mb-4 flex items-center justify-between border-b border-soil-100 pb-3">
              <h4 className="font-display text-lg font-bold text-soil-800">
                {editingAddress ? 'Edit Delivery Address' : 'Add New Address'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowAddressForm(false)
                  setAddressError('')
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-soil-100 text-soil-600 hover:bg-soil-200"
              >
                ✕
              </button>
            </div>

            {addressError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
                {addressError}
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    name="full_name"
                    value={addressForm.full_name}
                    onChange={handleAddressFormChange}
                    className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    required
                    type="tel"
                    name="mobile_number"
                    value={addressForm.mobile_number}
                    onChange={handleAddressFormChange}
                    maxLength={10}
                    className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                  Door No / Street Address *
                </label>
                <input
                  required
                  type="text"
                  name="address"
                  value={addressForm.address}
                  onChange={handleAddressFormChange}
                  className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                  placeholder="House/Flat No, Street, Area"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    Village / Town *
                  </label>
                  <input
                    required
                    type="text"
                    name="village"
                    value={addressForm.village}
                    onChange={handleAddressFormChange}
                    className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    placeholder="Village or Town"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    District *
                  </label>
                  <select
                    required
                    name="district"
                    value={addressForm.district}
                    onChange={handleAddressFormChange}
                    className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                  >
                    <option value="" disabled>Select District</option>
                    {TAMIL_NADU_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    State *
                  </label>
                  <input
                    required
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressFormChange}
                    className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                    Pincode *
                  </label>
                  <input
                    required
                    type="text"
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={handleAddressFormChange}
                    maxLength={6}
                    className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-soil-500 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={addressForm.landmark}
                  onChange={handleAddressFormChange}
                  className="w-full rounded-xl border border-soil-200 bg-white px-3 py-2 text-xs font-semibold text-soil-800 outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                  placeholder="Near landmark"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs font-semibold text-soil-700">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={addressForm.is_default}
                  onChange={handleAddressFormChange}
                  className="h-4 w-4 rounded border-soil-300 text-leaf-600 focus:ring-leaf-500"
                />
                Set as default delivery address
              </label>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false)
                    setAddressError('')
                  }}
                  className="flex-1 rounded-xl border border-soil-200 bg-white py-2.5 text-xs font-bold text-soil-700 transition hover:bg-soil-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="flex-1 rounded-xl bg-leaf-600 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-leaf-700 disabled:opacity-50"
                >
                  {savingAddress ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SiteFooter compact />
    </div>
  )
}