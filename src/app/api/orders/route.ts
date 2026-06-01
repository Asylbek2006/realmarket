import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware/require-auth'

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) return authResult
  const { user } = authResult

  const orders = await prisma.order.findMany({
    where: { userId: user.userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const serialized = orders.map((order) => ({
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
  }))

  return NextResponse.json({ orders: serialized })
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req)
  if (authResult instanceof NextResponse) return authResult
  const { user } = authResult

  const body = await req.json()
  const { items } = body as { items: Array<{ productId: string; quantity: number }> }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Items array must not be empty' }, { status: 400 })
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      let total = 0
      const resolvedItems: Array<{ productId: string; quantity: number; price: number }> = []

      for (const item of items) {
        const product = await tx.product.findFirst({
          where: { id: item.productId },
        })

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.title}`)
        }

        const price = Number(product.price)
        total += price * item.quantity
        resolvedItems.push({ productId: item.productId, quantity: item.quantity, price })
      }

      const newOrder = await tx.order.create({
        data: {
          userId: user.userId,
          total,
          items: {
            create: resolvedItems.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price,
            })),
          },
        },
      })

      for (const item of resolvedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return newOrder
    })

    return NextResponse.json(
      {
        orderId: order.id,
        total: order.total.toString(),
        status: order.status,
      },
      { status: 201 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('Insufficient stock')) {
      return NextResponse.json({ error: message }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
