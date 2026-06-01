'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

type OrderItem = {
  id: string
  quantity: number
}

type Order = {
  id: string
  status: OrderStatus
  total: number
  createdAt: string
  items: OrderItem[]
}

const STATUS_BADGE: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  PAID: {
    label: 'Paid',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  SHIPPED: {
    label: 'Shipped',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  DELIVERED: {
    label: 'Delivered',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_BADGE[status] ?? {
    label: status,
    className: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  }
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 border rounded-xl">
          <p className="text-zinc-500 mb-4">You have no orders yet.</p>
          <Button onClick={() => router.push('/products')}>
            Browse products
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
            const date = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })

            return (
              <div
                key={order.id}
                className="border rounded-xl px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs text-zinc-400 font-mono truncate">
                    #{order.id}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {date} &middot; {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
