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
      setSuccessMessage(data.message || 'OTP generated successfully')
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
      eyebrow="Welcome back"
      title="Log in to your account"
      description="Track orders and shop fresh farm products from your trusted local marketplace."
    >
        <div className="mb-6 grid grid-cols-2 rounded-xl bg-soil-100 p-1">
          <button
            type="button"
            onClick={() => switchMode('password')}
            className={`rounded-lg py-3 text-sm font-semibold transition-colors ${
              mode === 'password' ? 'bg-white text-leaf-700 shadow-sm' : 'text-soil-500'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => switchMode('otp')}
            className={`rounded-lg py-3 text-sm font-semibold transition-colors ${
              mode === 'otp' ? 'bg-white text-leaf-700 shadow-sm' : 'text-soil-500'
            }`}
          >
            OTP
          </button>
        </div>

        <AlertBanner message={formError} type="error" />
        <AlertBanner message={successMessage} type="success" />

        {mode === 'password' ? (
          <form onSubmit={handlePasswordLogin} noValidate>
            <FormInput
              id="mobile_number"
              label="Mobile Number"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
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

            <div className="mb-4 text-right">
              <Link to="/forgot-password" className="text-sm font-semibold text-leaf-600">
                Forgot password?
              </Link>
            </div>

            <PrimaryButton type="submit" loading={loading}>
              Log in
            </PrimaryButton>
          </form>
        ) : (
          <form onSubmit={handleOtpLogin} noValidate>
            <div className="mb-4">
              <label htmlFor="otp_mobile_number" className="mb-1.5 block text-sm font-semibold text-soil-700">
                Mobile Number
              </label>
              <div className="flex overflow-hidden rounded-xl border border-soil-200 bg-white focus-within:border-leaf-500 focus-within:ring-1 focus-within:ring-leaf-500">
                <span className="flex items-center border-r border-soil-100 px-4 text-sm font-medium text-soil-500">
                  +91
                </span>
                <input
                  id="otp_mobile_number"
                  type="tel"
                  inputMode="numeric"
                  placeholder="9080285866"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  maxLength={10}
                  autoComplete="tel"
                  disabled={otpSent}
                  className="min-w-0 flex-1 bg-white px-4 py-4 text-base text-soil-700 placeholder:text-soil-400 disabled:text-soil-500"
                />
              </div>
            </div>

            {!otpSent ? (
              <PrimaryButton type="button" onClick={handleSendOtp} loading={otpLoading}>
                Generate OTP
              </PrimaryButton>
            ) : (
              <>
                <FormInput
                  id="otp_code"
                  label="Enter OTP"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter the 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                />

                <div className="mb-4 flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setOtpCode('')
                      setDevOtp('')
                      setSuccessMessage('')
                    }}
                    className="font-medium text-soil-500"
                  >
                    Change Number
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="font-semibold text-leaf-700"
                  >
                    Resend OTP
                  </button>
                </div>

                {devOtp && (
                  <div className="mb-4 rounded-xl border border-soil-200 bg-soil-50 px-4 py-3">
                    <p className="text-xs font-semibold text-soil-600">Development OTP</p>
                    <p className="mt-1 font-mono text-xl font-bold tracking-[0.35em] text-soil-700">
                      {devOtp}
                    </p>
                  </div>
                )}

                <PrimaryButton type="submit" loading={loading}>
                  Verify OTP -&gt;
                </PrimaryButton>
              </>
            )}
          </form>
        )}

        <p className="mt-6 text-center text-sm text-soil-600">
          New here?{' '}
          <Link to="/register" className="font-semibold text-leaf-700">
            Create an account
          </Link>
        </p>
    </AuthLayout>
  )
}
