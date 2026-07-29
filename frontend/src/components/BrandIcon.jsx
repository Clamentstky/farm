import { BRAND_NAME, BRAND_TAGLINE } from '../data/brand'

export default function BrandIcon({ className = 'h-10 w-10', showText = false }) {
  return (
    <div className={`inline-flex items-center gap-3 ${showText ? '' : 'justify-center'}`}>
      <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e6806] via-[#118707] to-[#16a30a] p-1 text-white shadow-md shadow-leaf-800/25 ring-1 ring-white/20 transition hover:scale-105 ${className}`}>
        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gf-sun-grad" x1="20" y1="12" x2="44" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="gf-leaf-grad" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#FEF08A" />
            </linearGradient>
          </defs>

          {/* Golden Farm Sun */}
          <circle cx="32" cy="25" r="13" fill="url(#gf-sun-grad)" opacity="0.95" />

          {/* Rolling Green Hills */}
          <path d="M8 44C16 38 28 36 38 41C48 46 56 42 56 42V52C56 56 52 60 48 60H16C12 60 8 56 8 52V44Z" fill="#0A4D04" opacity="0.5" />
          <path d="M8 48C18 42 30 43 42 47C49 49 56 47 56 47V52C56 56.4 52.4 60 48 60H16C11.6 60 8 56.4 8 52V48Z" fill="#15803D" />

          {/* Sprouting Organic Leaves */}
          <path d="M32 12C32 12 43 21 41 33C39 43 28 44 28 44C28 44 24 33 28 23C30 18 32 12 32 12Z" fill="url(#gf-leaf-grad)" />
          <path d="M32 19C32 19 21 25 23 35C24.5 42 34 44 34 44C34 44 37 35 34 26C32.5 22 32 19 32 19Z" fill="#22C55E" />

          {/* Center Leaf Stem */}
          <path d="M32 15V46" stroke="#0E6806" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <span className="leading-tight">
          <span className="block font-display text-xl font-extrabold text-soil-800 tracking-tight">
            {BRAND_NAME}
          </span>
          <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-leaf-600">
            {BRAND_TAGLINE}
          </span>
        </span>
      )}
    </div>
  )
}
