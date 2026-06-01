import Link from 'next/link'
import { Package } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/product-card'
import { SearchBarWrapper } from '@/components/search-bar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const LIMIT = 20

type Props = {
  searchParams: Promise<{
    search?: string
    page?: string
    categoryId?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { search, page: pageParam, categoryId } = await searchParams

  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const skip = (page - 1) * LIMIT

  const where = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
  }

  const [rawProducts, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        seller: { select: { name: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: LIMIT,
      skip,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      where: { parentId: null },
    }),
  ])

  const products = rawProducts.map((p) => ({
    ...p,
    price: p.price.toString(),
  }))

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} {total === 1 ? 'listing' : 'listings'} found
          </p>
        </div>
        <SearchBarWrapper />
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/products"
          className={cn(
            'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted',
            !categoryId
              ? 'border-foreground bg-foreground text-background hover:bg-foreground/80'
              : 'border-border text-foreground'
          )}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?${new URLSearchParams({
              ...(search ? { search } : {}),
              categoryId: cat.id,
            }).toString()}`}
            className={cn(
              'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted',
              categoryId === cat.id
                ? 'border-foreground bg-foreground text-background hover:bg-foreground/80'
                : 'border-border text-foreground'
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <Package className="size-16 text-muted-foreground" />
          <div>
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or browse all categories.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/products?${new URLSearchParams({
                ...(search ? { search } : {}),
                ...(categoryId ? { categoryId } : {}),
                page: String(page - 1),
              }).toString()}`}
              className="inline-flex h-8 items-center rounded-lg border px-3 text-sm hover:bg-muted transition-colors"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/products?${new URLSearchParams({
                ...(search ? { search } : {}),
                ...(categoryId ? { categoryId } : {}),
                page: String(page + 1),
              }).toString()}`}
              className="inline-flex h-8 items-center rounded-lg border px-3 text-sm hover:bg-muted transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
