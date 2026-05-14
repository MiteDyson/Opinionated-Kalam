import { NextResponse, NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Admin page guard ──
  // Redirect unauthenticated users away from /admin pages instantly.
  // Firebase token verification still happens in API routes;
  // this just prevents the page from loading without a session.
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')?.value
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  const response = NextResponse.next()

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Content Security Policy (CSP) - Basic version
  // Note: Adjust this as needed for your specific external scripts/images
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; media-src 'self' https: blob: data:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.mongodb.net https://*.firebaseapp.com https://*.google.com https://*.imagekit.io; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

