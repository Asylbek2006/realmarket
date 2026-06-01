'use client'

import Link from 'next/link'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      {error.message && (
        <p className="text-sm text-muted-foreground max-w-md">{error.message}</p>
      )}
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
