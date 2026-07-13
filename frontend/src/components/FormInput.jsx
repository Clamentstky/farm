export default function FormInput({ label, error, id, ...props }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-soil-700">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-soil-700 placeholder:text-soil-400 transition-colors focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 ${
          error ? 'border-clay-500' : 'border-soil-200'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-clay-600">{error}</p>}
    </div>
  )
}
