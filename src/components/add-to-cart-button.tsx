'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cart'
import { toast } from 'sonner'

type AddToCartButtonProps = {
  product: {
    id: string
    title: string
    price: string
    images: string[]
    stock: number
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [qty, setQty] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const max = Math.min(product.stock, 10)

  function decrement() {
    setQty((q) => Math.max(1, q - 1))
  }

  function increment() {
    setQty((q) => Math.min(max, q + 1))
  }

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      addItem({
        productId: product.id,
        title: product.title,
        price: parseFloat(product.price),
        image: product.images[0],
        stock: product.stock,
      })
    }
    toast.success(`Added ${qty} item${qty > 1 ? 's' : ''} to cart`, {
      description: product.title,
    })
  }

  if (product.stock === 0) {
    return (
      <Button size="lg" className="w-full" disabled>
        Out of stock
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Quantity</span>
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={decrement}
            disabled={qty <= 1}
            className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium select-none">{qty}</span>
          <button
            type="button"
            onClick={increment}
            disabled={qty >= max}
            className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
        {product.stock <= 5 && (
          <span className="text-xs text-muted-foreground">
            Only {product.stock} left
          </span>
        )}
      </div>
      <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
        <ShoppingCart className="size-4" />
        Add to cart
      </Button>
    </div>
  )
}
