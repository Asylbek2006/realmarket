import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-white text-2xl font-bold tracking-tight">
            RealMarket
          </Link>
        </div>
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  )
}
