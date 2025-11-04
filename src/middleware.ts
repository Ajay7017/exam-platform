import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
    const isExamPage = req.nextUrl.pathname.startsWith('/exam/')

    // Redirect authenticated users away from login page
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Check for blocked users
    if (isAuth && token.isBlocked) {
      return NextResponse.redirect(new URL('/blocked', req.url))
    }

    // Protect admin routes
    if (isAdminPage && (!isAuth || token.role !== 'admin')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Protect student routes
    if ((isDashboard || isExamPage) && !isAuth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // Let middleware function handle authorization
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/exam/:path*',
    '/profile/:path*',
    '/results/:path*',
    '/login',
  ],
}