'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cart'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const total = useCartStore((state) => state.total)

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 flex flex-col items-center text-center gap-6">
        <ShoppingCart className="size-16 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Looks like you haven&apos;t added anything yet.
          </p>
        </div>
        <Button render={<Link href="/products" />}>
          Browse products
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Shopping cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Item list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 border rounded-xl p-4 bg-card"
            >
              {/* Image */}
              <div className="relative size-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                    No img
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${item.productId}`}
                    className="text-sm font-medium leading-snug line-clamp-2 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Remove ${item.title}`}
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 mt-auto">
                  {/* Qty controls */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2.5 py-1.5 hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium select-none">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  {/* Line total */}
                  <p className="text-sm font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 bg-card flex flex-col gap-4 sticky top-20">
            <h2 className="text-base font-semibold">Order summary</h2>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
              <span className="font-bold">${total().toFixed(2)}</span>
            </div>

            <div className="border-t pt-4 flex flex-col gap-3">
              <Button render={<Link href="/checkout" />} size="lg" className="w-full">
                Proceed to checkout
              </Button>
              <Button render={<Link href="/products" />} variant="outline" size="sm" className="w-full">
                Continue shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
