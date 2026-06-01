import { Navbar } from '@/components/navbar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-zinc-500">
        &copy; 2024 RealMarket
      </footer>
    </div>
  )
}
