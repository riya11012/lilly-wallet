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

  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value

  // Check if user is authenticated using JWT only (no database call)
  let isAuthenticated = false
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
      isAuthenticated = !!decoded.userId
    } catch (error) {
      // Invalid token
      isAuthenticated = false
    }
  }

  // Redirect logic
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}