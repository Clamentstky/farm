export default function CustomerProfilePanel({ customer, open, onClose, onLogout }) {
  if (!open) return null

  const createdAt = customer?.created_at
    ? new Date(customer.created_at).toLocaleDateString()
    : 'Not available'
  const initial = customer?.full_name?.charAt(0)?.toUpperCase() || 'C'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-3 sm:items-center sm:justify-end sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-[92vw] max-w-sm rounded-3xl bg-white/90 p-3 shadow-2xl backdrop-blur sm:max-w-md sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff3bd] text-xl font-bold text-[#118707] sm:h-14 sm:w-14 sm:text-2xl">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-leaf-600 sm:text-xs">
                Customer Profile
              </p>
              <h2 className="mt-1 truncate font-display text-lg font-semibold text-soil-700 sm:text-2xl">
                {customer?.full_name || 'Customer'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-soil-100 bg-white/80 text-base font-bold leading-none text-soil-700 sm:h-9 sm:w-9"
            aria-label="Close profile details"
          >
            x
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
          <ProfileRow label="Customer ID" value={customer?.customer_id} />
          <ProfileRow label="Mobile Number" value={customer?.mobile_number} />
          <ProfileRow label="Email" value={customer?.email} wide />
          <ProfileRow label="Village / Location" value={customer?.village} />
          <ProfileRow label="Member Since" value={createdAt} />
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-3 w-full rounded-2xl bg-leaf-600 px-4 py-2.5 text-sm font-bold !text-white shadow-sm transition hover:bg-leaf-700 sm:mt-4 sm:py-3"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

function ProfileRow({ label, value, wide = false }) {
  return (
    <div className={`rounded-2xl border border-soil-100 bg-soil-50/80 px-3 py-2.5 sm:px-4 sm:py-3 ${wide ? 'col-span-2' : ''}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-soil-400 sm:text-xs">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-soil-700">
        {value || 'Not available'}
      </p>
    </div>
  )
}
