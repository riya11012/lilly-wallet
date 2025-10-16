import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  phoneNumber: string
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Define protected and public paths
  const isProtectedPath = path.startsWith('/dashboard') || path.startsWith('/profile')
  const isPublicPath = path === '/login' || path === '/register'

  // For frontend-only authentication, we'll allow access to dashboard
  // The actual authentication check will be done on the client side
  // This prevents the middleware from blocking our localStorage-based auth
  
  // Only redirect if trying to access login while already authenticated
  // (This would be handled by the client-side auth check)
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}