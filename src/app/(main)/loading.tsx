export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
      {/* Page title skeleton */}
      <div className="h-8 w-48 bg-muted rounded-lg mb-8" />

      {/* Content rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-xl overflow-hidden bg-card">
            <div className="h-48 bg-muted" />
            <div className="p-4 flex flex-col gap-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-6 bg-muted rounded w-1/3 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
