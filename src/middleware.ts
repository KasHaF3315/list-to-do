import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get token from cookies or headers
    const token = request.cookies.get('auth-token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '')

    // Public routes that don't require authentication
    const publicRoutes = ['/auth', '/api', '/_next', '/favicon.ico']
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // Static assets and API routes - skip authentication
    if (pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.includes('.')) {
        return NextResponse.next()
    }

    // Home page - allow access but don't redirect
    if (pathname === '/') {
        return NextResponse.next()
    }

    // If user is not authenticated and trying to access protected route
    if (!token && !isPublicRoute && pathname !== '/auth') {
        // Only redirect if not already on auth page
        if (pathname !== '/auth') {
            return NextResponse.redirect(new URL('/auth', request.url))
        }
    }

    // If user is authenticated and trying to access auth page
    if (token && pathname === '/auth') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api routes (handled separately)
         */
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
}
