import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean up existing data
  await prisma.session.deleteMany()
  await prisma.otpCode.deleteMany()
  await prisma.user.deleteMany()

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      phoneNumber: '+91 9876543210',
      isVerified: true,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      phoneNumber: '+91 8765432109',
      isVerified: true,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      phoneNumber: '+91 7654321098',
      isVerified: false,
      firstName: 'Bob',
      lastName: 'Johnson',
    },
  })

  console.log('✅ Created users:', { user1, user2, user3 })

  // Create some sample OTP codes (for testing)
  const otpCode1 = await prisma.otpCode.create({
    data: {
      phoneNumber: '+91 1234567890',
      code: '123456',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
      isUsed: false,
    },
  })

  console.log('✅ Created OTP code for testing:', otpCode1)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })