export default function AlertBanner({ type = 'error', message }) {
  if (!message) return null

  const styles =
    type === 'error'
      ? 'bg-clay-500/10 text-clay-600 border-clay-500/30'
      : 'bg-leaf-500/10 text-leaf-700 border-leaf-500/30'

  return (
    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {message}
    </div>
  )
}
