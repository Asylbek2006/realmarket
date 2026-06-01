import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
} from '@/lib/auth'
import { registerSchema } from '@/lib/validators/auth'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 },
    )
  }

  const { email, password, name } = parsed.data
  const normalizedEmail = email.toLowerCase()

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: { email: normalizedEmail, passwordHash, name },
    select: { id: true, email: true, name: true, role: true },
  })

  const payload = { userId: user.id, email: user.email, role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  })

  const response = NextResponse.json({ user }, { status: 201 })
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
