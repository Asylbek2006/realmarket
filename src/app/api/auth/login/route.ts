import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  verifyPassword,
  signAccessToken,
  signRefreshToken,
} from '@/lib/auth'
import { loginSchema } from '@/lib/validators/auth'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 },
    )
  }

  const { email, password } = parsed.data
  const normalizedEmail = email.toLowerCase()

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  await prisma.refreshToken.deleteMany({ where: { userId: user.id } })

  const payload = { userId: user.id, email: user.email, role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  })

  const userOut = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }

  const response = NextResponse.json({ user: userOut }, { status: 200 })
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
