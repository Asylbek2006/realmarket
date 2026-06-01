'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/stores/cart'
import { toast } from 'sonner'

export type ProductCardProps = {
  product: {
    id: string
    title: string
    price: string
    images: string[]
    seller: { name: string }
    stock: number
    category?: { name: string } | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  function handleAddToCart() {
    addItem({
      productId: product.id,
      title: product.title,
      price: parseFloat(product.price),
      image: product.images[0],
      stock: product.stock,
    })
    toast.success('Added to cart', {
      description: product.title,
    })
  }

  return (
    <Card className="group/card overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover/card:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Package className="size-12" />
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary">Out of stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="pt-3 pb-1 flex flex-col gap-1">
        <Link href={`/products/${product.id}`}>
          <p className="font-medium leading-snug line-clamp-2 hover:underline text-sm">
            {product.title}
          </p>
        </Link>
        <p className="font-bold text-base">${product.price}</p>
        <p className="text-xs text-muted-foreground">by {product.seller.name}</p>
        {product.category && (
          <Badge variant="outline" className="w-fit text-xs">
            {product.category.name}
          </Badge>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-3 bg-transparent border-0">
        <Button
          size="sm"
          className="w-full"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}
