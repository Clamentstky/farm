export default function LoadingState({ message = 'Loading fresh products...' }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-soil-100 bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-leaf-500 border-t-transparent" />
        <p className="text-sm font-semibold text-soil-500">{message}</p>
      </div>
    </div>
  )
}
