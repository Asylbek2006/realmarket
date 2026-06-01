import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-8xl font-extrabold tracking-tight text-foreground">404</h1>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <p className="text-sm text-muted-foreground max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Go home
      </Link>
    </div>
  )
}
