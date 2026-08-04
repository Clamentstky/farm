export default function OrderHeader({ children }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-soil-900">My Orders</h1>
        {children && (
          <div className="shrink-0">
            {children}
          </div>
        )}
      </div>
      <p className="mt-2 text-[15px] font-medium text-soil-900 max-w-sm leading-snug">
        Track fulfillment progress and manage all your farm deliveries
      </p>
    </div>
  )
}
