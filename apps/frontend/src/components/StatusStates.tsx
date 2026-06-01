/** Loading skeleton shown while the action center is being fetched. */
export function LoadingState() {
  return (
    <div data-testid="loading-state" className="animate-pulse space-y-4">
      <div className="h-32 rounded-xl bg-slate-200" />
      <div className="h-6 w-40 rounded bg-slate-200" />
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

/** Error card with a retry action. */
export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      data-testid="error-state"
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
    >
      <p className="font-semibold text-red-800">Couldn’t load the action center</p>
      <p className="mt-1 text-sm text-red-700">
        {message ?? "Something went wrong while contacting the server."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
