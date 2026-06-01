import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
  }

  const response = NextResponse.json({ ok: true }, { status: 200 })
  response.cookies.set('access_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  response.cookies.set('refresh_token', '', {
    httpOnly: true,
    path: '/api/auth',
    maxAge: 0,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
