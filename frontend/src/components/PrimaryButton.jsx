export default function PrimaryButton({ children, loading, className = '', ...props }) {
  return (
    <button
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-600 px-4 py-3.5 text-base font-semibold text-white transition-colors active:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  )
}
