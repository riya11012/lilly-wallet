import { NextRequest, NextResponse } from 'next/server'
import { formatPhoneNumber } from '@/lib/phone'
import { OTPService } from '@/lib/otp'
import { AuthService } from '@/lib/auth'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json()

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    // Format phone number
    const formattedNumber = formatPhoneNumber(phoneNumber)
    if (!formattedNumber) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    // Verify OTP
    const isValidOTP = await OTPService.verifyOTP(formattedNumber, otp)
    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { phoneNumber: formattedNumber },
    })

    if (!user) {
      user = await db.user.create({
        data: {
          phoneNumber: formattedNumber,
          isVerified: true,
        },
      })
    } else {
      // Update user as verified
      user = await db.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      })
    }

    // Generate JWT token
    const token = AuthService.generateToken({
      userId: user.id,
      phoneNumber: user.phoneNumber,
    })

    // Create session
    await AuthService.createSession(user.id, token)

    // Set HTTP-only cookie
    const cookieStore = cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}