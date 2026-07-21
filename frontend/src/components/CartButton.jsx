import { Link } from 'react-router-dom'

export default function CartButton({ count = 0, to = '/cart' }) {
  return (
    <Link
      to={to}
      className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#61b31a] text-white shadow-sm shadow-[#4e9314]/25 transition hover:brightness-105"
      aria-label="Cart"
      title="Cart"
    >
      <CartIcon />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#4c9c18] shadow-sm">
          {count}
        </span>
      )}
    </Link>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path
        d="M3.5 5h2l2.1 9.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5l1.3-5.2H8.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12.5h8.5l-.5 2.2H9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 17.5h0"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="10" cy="19" r="1.4" fill="currentColor" />
      <circle cx="17" cy="19" r="1.4" fill="currentColor" />
      <path
        d="M14 4.5v4m-2-2h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
