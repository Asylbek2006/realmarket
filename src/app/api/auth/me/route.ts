import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 })
  }

  let payload: ReturnType<typeof verifyAccessToken>
  try {
    payload = verifyAccessToken(accessToken)
  } catch {
    return NextResponse.json({ error: 'Invalid access token' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user }, { status: 200 })
}
