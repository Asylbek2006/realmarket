import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Package, Store } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Badge } from '@/components/ui/badge'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    select: { title: true },
  })
  if (!product) return { title: 'Product not found — RealMarket' }
  return { title: `${product.title} — RealMarket` }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
  })

  if (!product) notFound()

  const serialized = {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price.toString(),
    images: product.images,
    stock: product.stock,
    seller: product.seller,
    category: product.category,
    createdAt: product.createdAt.toISOString(),
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          {serialized.images[0] ? (
            <Image
              src={serialized.images[0]}
              alt={serialized.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Package className="size-20" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          {/* Category badge */}
          {serialized.category && (
            <Link href={`/products?categoryId=${serialized.category.id}`}>
              <Badge variant="secondary" className="w-fit">
                {serialized.category.name}
              </Badge>
            </Link>
          )}

          {/* Title */}
          <h1 className="text-2xl font-bold leading-snug">{serialized.title}</h1>

          {/* Price */}
          <p className="text-3xl font-bold">${serialized.price}</p>

          {/* Seller */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Store className="size-4" />
            <span>Sold by </span>
            <span className="font-medium text-foreground">{serialized.seller.name}</span>
          </div>

          {/* Stock badge */}
          <div>
            {serialized.stock > 0 ? (
              <Badge variant="outline" className="text-xs">
                {serialized.stock > 10 ? 'In stock' : `Only ${serialized.stock} left`}
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Out of stock
              </Badge>
            )}
          </div>

          {/* Description */}
          {serialized.description && (
            <div>
              <h2 className="text-sm font-semibold mb-1">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {serialized.description}
              </p>
            </div>
          )}

          {/* Add to cart */}
          <div className="pt-2">
            <AddToCartButton product={serialized} />
          </div>
        </div>
      </div>
    </div>
  )
}
