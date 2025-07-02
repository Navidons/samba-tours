import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Temporarily disable middleware to test authentication
  return NextResponse.next()
  
  // Original code commented out for now
  /*
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession()

    console.log('Middleware - URL:', req.nextUrl.pathname, 'Session:', session ? 'Found' : 'None')

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!session) {
        console.log('Middleware - No session for admin route, redirecting to signin')
        return NextResponse.redirect(new URL('/signin', req.url))
      } else {
        console.log('Middleware - Session found for admin route:', session.user?.email)
      }
    }

    // Redirect authenticated users away from signin page
    if (req.nextUrl.pathname === '/signin' && session) {
      console.log('Middleware - Authenticated user on signin page, redirecting to admin')
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    return res
  } catch (error) {
    // If there's an error with auth, allow the request to continue
    // This prevents middleware from blocking the app
    console.error('Middleware auth error:', error)
    return res
  }
  */
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/signin',
  ],
} 