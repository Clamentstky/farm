import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'

export default function BrandIcon({ className = 'h-10 w-10', showText = false }) {
  return (
    <div className={`inline-flex items-center gap-3 ${showText ? '' : 'justify-center'}`}>
      <div className={`flex shrink-0 items-center justify-center rounded-full bg-leaf-600 text-white shadow-sm shadow-leaf-700/20 ${className}`}>
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="h-[70%] w-[70%]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 27.5c0-9.5 7.8-17.2 17.3-17.2h6.2v6.2C35.5 26 27.8 33.7 18.3 33.7H12v-6.2Z"
            fill="#F7D65A"
          />
          <path
            d="M16.4 31.6c5.1-8.2 10.7-13 16.8-14.5"
            stroke="#118707"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M11.5 35.5h24.8"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <span className="leading-tight">
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">
            {BRAND_NAME}
          </span>
          <span className="block font-display text-xl font-semibold text-soil-700">
            {BRAND_TAGLINE}
          </span>
        </span>
      )}
    </div>
  )
}
