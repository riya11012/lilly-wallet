import jwt from 'jsonwebtoken'
import { db } from './db'

export interface JWTPayload {
  userId: string
  phoneNumber: string
}

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET!

  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '7d' })
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload
    } catch {
      return null
    }
  }

  static async createSession(userId: string, token: string) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    return await db.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    })
  }

  static async validateSession(token: string) {
    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await db.session.delete({ where: { token } })
      }
      return null
    }

    return session
  }

  static async deleteSession(token: string) {
    await db.session.deleteMany({ where: { token } })
  }
}