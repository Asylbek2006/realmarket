import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware/require-auth'
import { updateProductSchema } from '@/lib/validators/product'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: { seller: true, category: true },
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json({ ...product, price: product.price.toString() })
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) return authResult
  const { user } = authResult

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  if (product.sellerId !== user.userId && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = updateProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const updated = await prisma.product.update({
    where: { id },
    data: parsed.data,
    include: { seller: true, category: true },
  })

  return NextResponse.json({ ...updated, price: updated.price.toString() })
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) return authResult
  const { user } = authResult

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  if (product.sellerId !== user.userId && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } })
  if (orderItemCount > 0) {
    return NextResponse.json(
      { error: 'Cannot delete product with existing order items' },
      { status: 409 },
    )
  }

  await prisma.product.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
