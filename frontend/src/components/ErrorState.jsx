export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-clay-500/20 bg-white p-5 text-center">
      <p className="text-sm font-semibold text-clay-600">
        {message || 'Unable to load data. Please try again.'}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-soil-700 px-4 py-2 text-sm font-bold text-white"
        >
          Retry
        </button>
      )}
    </div>
  )
}
