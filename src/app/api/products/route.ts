import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware/require-auth'
import { createProductSchema } from '@/lib/validators/product'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const search = searchParams.get('search') ?? ''
  const categoryId = searchParams.get('categoryId')
  const sellerId = searchParams.get('sellerId')

  const where: Prisma.ProductWhereInput = {}

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (categoryId) where.categoryId = categoryId
  if (sellerId) where.sellerId = sellerId

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { seller: true, category: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ])

  const serialized = products.map((p) => ({ ...p, price: p.price.toString() }))

  return NextResponse.json({
    products: serialized,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) return authResult
  const { user } = authResult

  if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const product = await prisma.product.create({
    data: { ...parsed.data, sellerId: user.userId },
    include: { seller: true, category: true },
  })

  return NextResponse.json({ ...product, price: product.price.toString() }, { status: 201 })
}
