import { NextRequest, NextResponse } from 'next/server'
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/phone'
import { OTPService } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Format phone number to E.164
    const formattedNumber = formatPhoneNumber(phoneNumber)
    if (!formattedNumber) {
      return NextResponse.json(
        { error: 'Unable to format phone number' },
        { status: 400 }
      )
    }

    // Generate and save OTP
    const otp = await OTPService.createOTP(formattedNumber)

    // Send OTP
    const sent = await OTPService.sendOTP(formattedNumber, otp)
    
    if (!sent) {
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'OTP sent successfully',
      phoneNumber: formattedNumber,
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}