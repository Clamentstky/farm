import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center bg-soil-50 px-6 text-center">
      <h1 className="font-display text-4xl font-semibold text-soil-700">404</h1>
      <p className="mt-2 text-sm text-soil-600">This page doesn't exist.</p>
      <Link to="/login" className="mt-6 font-semibold text-leaf-600">
        Back to login
      </Link>
    </div>
  )
}
