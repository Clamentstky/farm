import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import PrimaryButton from '../components/PrimaryButton'
import AlertBanner from '../components/AlertBanner'
import { registerCustomer } from '../api/auth'
import { extractErrorMessage } from '../api/client'
import AuthLayout from '../components/AuthLayout'

const initialForm = {
  full_name: '',
  mobile_number: '',
  email: '',
  village: '',
  password: '',
  confirm_password: '',
}

export default function Register() {
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const errors = {}
    if (form.full_name.trim().length < 2) errors.full_name = 'Enter your full name'
    if (!/^[6-9]\d{9}$/.test(form.mobile_number)) errors.mobile_number = 'Enter a valid 10-digit mobile number'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address'
    if (form.village.trim().length < 2) errors.village = 'Enter your village or location'
    if (form.password.length < 6) errors.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm_password) errors.confirm_password = 'Passwords do not match'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    setLoading(true)
    try {
      await registerCustomer(form)
      navigate('/registration-success', {
        replace: true,
        state: { mobileNumber: form.mobile_number },
      })
    } catch (err) {
      setFormError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Join the customer portal"
      description="Register with your mobile number to get a unique Customer ID and unlock fresh daily deliveries."
    >
      <AlertBanner message={formError} />

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          id="full_name"
          name="full_name"
          label="Full Name"
          type="text"
          placeholder="e.g. Ramesh Kumar"
          value={form.full_name}
          onChange={handleChange}
          error={fieldErrors.full_name}
          autoComplete="name"
        />
        <FormInput
          id="mobile_number"
          name="mobile_number"
          label="Mobile Number"
          type="tel"
          inputMode="numeric"
          placeholder="10-digit mobile number"
          value={form.mobile_number}
          onChange={handleChange}
          error={fieldErrors.mobile_number}
          maxLength={10}
          autoComplete="tel"
        />
        <FormInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <FormInput
          id="village"
          name="village"
          label="Village / Location"
          type="text"
          placeholder="e.g. Sulur, Coimbatore"
          value={form.village}
          onChange={handleChange}
          error={fieldErrors.village}
        />
        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        <FormInput
          id="confirm_password"
          name="confirm_password"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          value={form.confirm_password}
          onChange={handleChange}
          error={fieldErrors.confirm_password}
          autoComplete="new-password"
        />

        <PrimaryButton type="submit" loading={loading} className="mt-2">
          Create account
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-soil-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-leaf-600">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
