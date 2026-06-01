'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Product = {
  id: string
  title: string
  price: number
  stock: number
  images: string[]
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return <Badge variant="destructive">Out of stock</Badge>
  }
  if (stock <= 5) {
    return <Badge variant="outline" className="text-amber-600 border-amber-300">Low stock ({stock})</Badge>
  }
  return <Badge variant="outline" className="text-green-700 border-green-300">In stock ({stock})</Badge>
}

export default function SellPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/sell')
    }
  }, [user, authLoading, router])

  const fetchProducts = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch(`/api/products?sellerId=${user.id}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products ?? data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Listing deleted')
        await fetchProducts()
      } else {
        const data = await res.json()
        toast.error(data.error ?? 'Failed to delete listing')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Skeleton className="h-9 w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button onClick={() => router.push('/sell/products/new')}>
          New listing
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 border rounded-xl">
          <p className="text-zinc-500 mb-4">You have no listings yet.</p>
          <Button onClick={() => router.push('/sell/products/new')}>
            Create your first listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-video bg-zinc-100 relative">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                    No image
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col gap-2 flex-1">
                <h2 className="font-semibold text-sm leading-tight line-clamp-2">
                  {product.title}
                </h2>

                <div className="flex items-center justify-between">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <StockBadge stock={product.stock} />
                </div>

                <div className="flex gap-2 mt-auto pt-2">
                  <a
                    href={`/sell/products/${product.id}/edit`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 text-center')}
                  >
                    Edit
                  </a>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(product.id, product.title)}
                    disabled={deleting === product.id}
                  >
                    {deleting === product.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
