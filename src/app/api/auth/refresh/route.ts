import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from '@/lib/auth'

export async function POST(req: NextRequest) {
  const oldRefreshToken = req.cookies.get('refresh_token')?.value
  if (!oldRefreshToken) {
    return NextResponse.json({ error: 'Missing refresh token' }, { status: 401 })
  }

  let payload: ReturnType<typeof verifyRefreshToken>
  try {
    payload = verifyRefreshToken(oldRefreshToken)
  } catch {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: oldRefreshToken },
  })
  if (!stored) {
    return NextResponse.json({ error: 'Refresh token not found' }, { status: 401 })
  }

  if (stored.expiresAt <= new Date()) {
    await prisma.refreshToken.delete({ where: { id: stored.id } })
    return NextResponse.json({ error: 'Refresh token expired' }, { status: 401 })
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } })

  const tokenPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  }
  const accessToken = signAccessToken(tokenPayload)
  const refreshToken = signRefreshToken(tokenPayload)

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: payload.userId, expiresAt },
  })

  const response = NextResponse.json({ ok: true }, { status: 200 })
  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    path: '/',
    maxAge: 900,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    path: '/api/auth',
    maxAge: 604800,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
