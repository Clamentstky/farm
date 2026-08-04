import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import PrimaryButton from '../components/PrimaryButton'
import AlertBanner from '../components/AlertBanner'
import { loginWithPassword, requestOtp, verifyOtp } from '../api/auth'
import { extractErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'

export default function Login() {
  const [mode, setMode] = useState('password') // 'password' | 'otp'
  const [mobileNumber, setMobileNumber] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [devOtp, setDevOtp] = useState('')
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const validateMobile = () => {
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setFormError('Enter a valid 10-digit mobile number')
      return false
    }
    return true
  }

  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validateMobile()) return
    if (!password) {
      setFormError('Enter your password')
      return
    }

    setLoading(true)
    try {
      const data = await loginWithPassword({ mobile_number: mobileNumber, password })
      login(data.access_token, data.customer)
      navigate('/customer/dashboard', { replace: true })
    } catch (err) {
      setFormError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setFormError('')
    setSuccessMessage('')
    if (!validateMobile()) return

    setOtpLoading(true)
    try {
      const data = await requestOtp(mobileNumber)
      setOtpSent(true)
      setDevOtp(data.dev_otp || '')
      setSuccessMessage(data.message || 'OTP sent successfully to your mobile number')
    } catch (err) {
      setFormError(extractErrorMessage(err))
    } finally {
      setOtpLoading(false)
    }
  }

  const handleOtpLogin = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validateMobile()) return
    if (!/^\d{6}$/.test(otpCode)) {
      setFormError('Enter the 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const data = await verifyOtp({ mobile_number: mobileNumber, otp_code: otpCode })
      login(data.access_token, data.customer)
      navigate('/customer/dashboard', { replace: true })
    } catch (err) {
      setFormError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setFormError('')
    setSuccessMessage('')
    setOtpSent(false)
    setOtpCode('')
    setDevOtp('')
  }

  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Login to FarmNest"
      description="Access your farm-fresh orders and enjoy daily village deliveries."
    >
      {/* Mode Switcher Pills */}
      <div className="mb-6 grid grid-cols-2 rounded-2xl bg-soil-100/80 p-1.5 text-center text-xs font-bold shadow-2xs">
        <button
          type="button"
          onClick={() => switchMode('password')}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${
            mode === 'password'
              ? 'bg-[#118707] text-white shadow-xs'
              : 'text-soil-600 hover:text-soil-800'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Password</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode('otp')}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${
            mode === 'otp'
              ? 'bg-[#118707] text-white shadow-xs'
              : 'text-soil-600 hover:text-soil-800'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>OTP Login</span>
        </button>
      </div>

      <AlertBanner message={formError} type="error" />
      <AlertBanner message={successMessage} type="success" />

      {mode === 'password' ? (
        <form onSubmit={handlePasswordLogin} noValidate className="space-y-4">
          <FormInput
            id="mobile_number"
            label="Mobile Number"
            type="tel"
            inputMode="numeric"
            placeholder="Enter 10-digit mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            maxLength={10}
            autoComplete="tel"
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-1.5 font-semibold text-soil-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-soil-300 text-leaf-600 focus:ring-leaf-500" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="font-bold text-leaf-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <PrimaryButton type="submit" loading={loading} className="w-full mt-2 min-h-[48px] text-base font-bold shadow-md">
            Log In →
          </PrimaryButton>
        </form>
      ) : (
        <form onSubmit={handleOtpLogin} noValidate className="space-y-4">
          <div>
            <label htmlFor="otp_mobile_number" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-soil-700">
              Mobile Number
            </label>
            <div className="flex overflow-hidden rounded-xl border border-soil-200 bg-white focus-within:border-leaf-500 focus-within:ring-2 focus-within:ring-leaf-500/20 transition">
              <span className="flex items-center border-r border-soil-100 bg-soil-50 px-3.5 text-xs font-bold text-soil-600">
                🇮🇳 +91
              </span>
              <input
                id="otp_mobile_number"
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                maxLength={10}
                autoComplete="tel"
                disabled={otpSent}
                className="min-w-0 flex-1 bg-white px-4 py-3 text-sm text-soil-800 font-semibold placeholder:text-soil-400 focus:outline-none disabled:bg-soil-50 disabled:text-soil-500"
              />
            </div>
          </div>

          {!otpSent ? (
            <PrimaryButton type="button" onClick={handleSendOtp} loading={otpLoading} className="w-full min-h-[48px] text-base font-bold shadow-md">
              Send OTP Code
            </PrimaryButton>
          ) : (
            <div className="space-y-4 pt-1">
              <FormInput
                id="otp_code"
                label="Enter 6-Digit OTP"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
              />

              <div className="flex items-center justify-between text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false)
                    setOtpCode('')
                    setDevOtp('')
                    setSuccessMessage('')
                  }}
                  className="text-soil-500 hover:text-soil-800"
                >
                  ← Edit Number
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-leaf-700 hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              {devOtp && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-center shadow-2xs">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Development Mode OTP</p>
                  <p className="mt-1 font-mono text-2xl font-black tracking-[0.3em] text-emerald-900">
                    {devOtp}
                  </p>
                </div>
              )}

              <PrimaryButton type="submit" loading={loading} className="w-full min-h-[48px] text-base font-bold shadow-md">
                Verify OTP & Login →
              </PrimaryButton>
            </div>
          )}
        </form>
      )}

      {/* Switch to Register link card */}
      <div className="mt-6 rounded-2xl border border-soil-100 bg-soil-50/70 p-4 text-center">
        <p className="text-xs font-semibold text-soil-600">
          Don't have an account yet?
        </p>
        <Link
          to="/register"
          className="mt-1.5 inline-block font-bold text-[#118707] hover:underline text-sm"
        >
          Create New Account →
        </Link>
      </div>
    </AuthLayout>
  )
}
