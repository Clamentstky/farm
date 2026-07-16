import BrandIcon from './BrandIcon'

export default function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f7f1e8_0%,_#fffaf2_52%,_#eef5e9_100%)] px-4 py-6 sm:px-6">
      <div className="w-full max-w-[470px] rounded-2xl border border-white/80 bg-white/95 p-5 shadow-[0_24px_70px_-32px_rgba(43,75,31,0.55)] sm:p-8">
        <div className="mb-7">
          <BrandIcon showText />
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-soil-400">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-soil-700">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-soil-600">{description}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
