import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware/require-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request)
  if (authResult instanceof NextResponse) return authResult
  const { user } = authResult

  const { id } = await params

  const order = await prisma.order.findFirst({
    where: { id, userId: user.userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const serialized = {
    ...order,
    total: order.total.toString(),
    items: order.items.map((item) => ({
      ...item,
      price: item.price.toString(),
      product: {
        ...item.product,
        price: item.product.price.toString(),
      },
    })),
  }

  return NextResponse.json({ order: serialized })
}
