import { db } from './db'
import twilio from 'twilio'

export class OTPService {
  /*private static twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )*/

  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  static async createOTP(phoneNumber: string): Promise<string> {
    const code = process.env.NODE_ENV === 'development' || process.env.USE_STATIC_OTP === 'true' 
      ? '123456' 
      : this.generateOTP()

    // Delete existing OTPs for this phone number
    await db.otpCode.deleteMany({
      where: { phoneNumber, isUsed: false },
    })

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // 10 minutes expiry

    await db.otpCode.create({
      data: {
        phoneNumber,
        code,
        expiresAt,
      },
    })

    return code
  }

  static async sendOTP(phoneNumber: string, code: string): Promise<boolean> {
    try {
      
      if (process.env.NODE_ENV === 'development' || process.env.USE_STATIC_OTP === 'true') {
        console.log(`📱 DEVELOPMENT MODE - OTP for ${phoneNumber}: ${code}`)
        console.log(`🔒 Use this OTP to login: ${code}`)
        return true
      }

      // await this.twilioClient.messages.create({
      //   body: `Your verification code is: ${code}. Valid for 10 minutes.`,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: phoneNumber,
      // })

      console.log(`📱 OTP for ${phoneNumber}: ${code}`)

      return true
    } catch (error) {
      console.error('Failed to send OTP:', error)
      return false
    }
  }

  static async verifyOTP(phoneNumber: string, code: string): Promise<boolean> {
    const otpRecord = await db.otpCode.findFirst({
      where: {
        phoneNumber,
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    })

    if (!otpRecord) {
      return false
    }

    // Mark OTP as used
    await db.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    })

    return true
  }

  static async cleanupExpiredOTPs() {
    await db.otpCode.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isUsed: true },
        ],
      },
    })
  }
}