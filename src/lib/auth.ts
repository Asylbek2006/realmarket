import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
export type JWTPayload = { userId: string; email: string; role: string }
export const hashPassword = (p: string) => bcrypt.hash(p, 12)
export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h)
export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' })
}
export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' })
}
export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JWTPayload
}
export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JWTPayload
}
