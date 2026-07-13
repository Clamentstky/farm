import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import PrimaryButton from '../components/PrimaryButton'
import AlertBanner from '../components/AlertBanner'
import { forgotPassword, resetPassword } from '../api/auth'
import { extractErrorMessage } from '../api/client'

export default function ForgotPassword() {
  const [step, setStep] = useState('request') // 'request' | 'reset'
  const [mobileNumber, setMobileNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [devOtp, setDevOtp] = useState('')
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setFormError('Enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    try {
      const data = await forgotPassword(mobileNumber)
      setDevOtp(data.dev_otp || '')
      setSuccessMessage(data.message || 'OTP generated successfully')
      setStep('reset')
    } catch (err) {
      setFormError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!/^\d{6}$/.test(otpCode)) {
      setFormError('Enter the 6-digit OTP')
      return
    }
    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await resetPassword({
        mobile_number: mobileNumber,
        otp_code: otpCode,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      })
      navigate('/login', { replace: true, state: { passwordReset: true } })
    } catch (err) {
      setFormError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell bg-soil-50 px-6 py-10">
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium uppercase tracking-wide text-leaf-600">Account recovery</p>
        <h1 className="font-display text-3xl font-semibold text-soil-700">Reset your password</h1>
        <p className="mt-2 text-sm text-soil-600">
          {step === 'request'
            ? "We'll send a one-time code to your registered mobile number."
            : 'Enter the code and choose a new password.'}
        </p>
      </div>

      <AlertBanner message={formError} type="error" />
      <AlertBanner message={successMessage} type="success" />

      {step === 'request' ? (
        <form onSubmit={handleRequestOtp} noValidate>
          <FormInput
            id="mobile_number"
            label="Mobile Number"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            maxLength={10}
          />
          <PrimaryButton type="submit" loading={loading}>
            Send OTP
          </PrimaryButton>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} noValidate>
          {devOtp && (
            <div className="mb-4 rounded-xl border border-soil-200 bg-soil-50 px-4 py-3">
              <p className="text-xs font-semibold text-soil-600">Development OTP</p>
              <p className="mt-1 font-mono text-xl font-bold tracking-[0.35em] text-soil-700">
                {devOtp}
              </p>
            </div>
          )}
          <FormInput
            id="otp_code"
            label="Enter OTP"
            type="text"
            inputMode="numeric"
            placeholder="6-digit code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            maxLength={6}
          />
          <FormInput
            id="new_password"
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <FormInput
            id="confirm_password"
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <PrimaryButton type="submit" loading={loading}>
            Reset password
          </PrimaryButton>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-soil-600">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-leaf-600">
          Log in
        </Link>
      </p>
    </div>
  )
}
