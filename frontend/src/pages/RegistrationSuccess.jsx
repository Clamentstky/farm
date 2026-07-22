import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import PrimaryButton from '../components/PrimaryButton'

export default function RegistrationSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const mobileNumber = location.state?.mobileNumber || ''

  return (
    <AuthLayout
      eyebrow="Registration successful"
      title="Your account is ready"
      description="Please log in with your mobile number and password to open your customer dashboard."
    >
      {mobileNumber && (
        <div className="mb-5 rounded-xl border border-leaf-100 bg-leaf-50 px-4 py-3 text-sm font-semibold text-leaf-700">
          Account created for +91 {mobileNumber}
        </div>
      )}

      <PrimaryButton type="button" onClick={() => navigate('/login', { replace: true })}>
        Go to login
      </PrimaryButton>

      <p className="mt-6 text-center text-sm text-soil-600">
        Need to create another account?{' '}
        <Link to="/register" className="font-semibold text-leaf-700">
          Register again
        </Link>
      </p>
    </AuthLayout>
  )
}
