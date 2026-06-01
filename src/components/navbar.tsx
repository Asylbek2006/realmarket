'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Search } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/stores/cart'
import { useAuth } from '@/lib/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const items = useCartStore((state) => state.items)
  const { user, loading, logout } = useAuth()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl shrink-0">
          RealMarket
        </Link>

        {/* Search — hidden on mobile */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-lg items-center border rounded-full overflow-hidden"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="ml-auto flex items-center gap-2">
          {/* Cart */}
          <Link href="/cart" className="relative p-2">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {itemCount}
              </Badge>
            )}
          </Link>

          {/* Auth */}
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" size="sm">{user.name}</Button>} />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/sell')}>
                      Sell
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/orders')}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
                    Sign in
                  </Button>
                  <Button size="sm" onClick={() => router.push('/register')}>
                    Get started
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
