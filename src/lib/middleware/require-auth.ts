import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, JWTPayload } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function getAuthUser(req: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = req.cookies.get('access_token')?.value
    if (!token) return null
    return verifyAccessToken(token)
  } catch {
    return null
  }
}

export async function requireAuth(
  req: NextRequest,
): Promise<{ user: JWTPayload } | NextResponse> {
  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return { user }
}
