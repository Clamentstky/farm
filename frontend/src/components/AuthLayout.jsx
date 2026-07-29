import { Link } from 'react-router-dom'
import BrandIcon from './BrandIcon'
import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'

export default function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-soil-50 p-4 py-8 text-soil-700 sm:p-8">
      {/* Brand Header */}
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center justify-center gap-3 py-2">
          <BrandIcon className="h-10 w-10" />
          <div className="text-left">
            <span className="font-display text-xl font-extrabold text-soil-800 leading-none block">
              {BRAND_NAME}
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-leaf-600">
              {BRAND_TAGLINE}
            </span>
          </div>
        </Link>
      </div>

      {/* Centered Auth Card */}
      <div className="my-auto w-full max-w-md rounded-3xl border border-soil-100 bg-white p-6 shadow-[0_24px_70px_-28px_rgba(17,135,7,0.22)] sm:p-9">
        <div className="mb-6">
          {eyebrow && (
            <span className="inline-block rounded-md bg-leaf-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-leaf-700">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-2 font-display text-2xl font-bold text-soil-800 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-xs text-soil-500 sm:text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {children}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs font-semibold text-soil-400">
        <p>© 2026 {BRAND_NAME}. Fresh from local farms.</p>
      </div>
    </div>
  )
}
