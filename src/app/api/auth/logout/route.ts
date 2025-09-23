import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')?.value

    if (token) {
      // Delete session from database
      await AuthService.deleteSession(token)
    }

    // Clear the cookie
    cookieStore.delete('auth_token')

    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}