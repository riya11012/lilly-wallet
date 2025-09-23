import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token' },
        { status: 401 }
      )
    }

    // Validate session
    const session = await AuthService.validateSession(token)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        phoneNumber: session.user.phoneNumber,
        isVerified: session.user.isVerified,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        email: session.user.email,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}