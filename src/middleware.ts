import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Paths that bots commonly probe for vulnerabilities.
 * Any request matching these patterns returns a 404 immediately.
 */
const BLOCKED_PATHS = [
  /^\/.env/,
  /^\/.git/,
  /^\/wp-admin/,
  /^\/wp-login/,
  /^\/wp-content/,
  /^\/wp-includes/,
  /^\/xmlrpc\.php/,
  /^\/\.htaccess/,
  /^\/\.htpasswd/,
  /^\/admin\/?$/,
  /^\/phpmyadmin/i,
  /^\/cgi-bin/,
  /^\/\.DS_Store/,
  /^\/config\.php/,
  /^\/\.well-known\/(?!security\.txt)/,
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* ── Block honeypot / exploit paths ── */
  for (const pattern of BLOCKED_PATHS) {
    if (pattern.test(pathname)) {
      return new NextResponse(null, { status: 404 })
    }
  }

  /* ── Reinforce security headers at runtime ── */
  const response = NextResponse.next()

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, PDFs)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|pdf)$).*)',
  ],
}
