'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/stores/cart'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const total = useCartStore((state) => state.total)

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? 'Failed to place order')
        return
      }

      clearCart()
      toast.success('Order placed!')
      router.push('/orders')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Shipping form */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Shipping details</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <input
                id="address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Almaty"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Kazakhstan"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="+7 700 000 0000"
              />
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? 'Placing order...' : `Place order — $${total().toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order summary */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Order summary</h2>
          <div className="border rounded-xl bg-card p-6 flex flex-col gap-4">
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate flex-1 text-muted-foreground">
                    {item.title}
                    <span className="ml-1 text-xs">x{item.quantity}</span>
                  </span>
                  <span className="font-medium shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t pt-4 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>${total().toFixed(2)}</span>
            </div>

            {user && (
              <p className="text-xs text-muted-foreground">
                Ordering as <span className="font-medium">{user.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
