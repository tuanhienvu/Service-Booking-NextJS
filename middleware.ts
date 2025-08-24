import { type NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/', // Home page
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/auth/callback',
    '/services', // Services page
    '/about', // About page
  ];
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path));

  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value;

  // If accessing public path and user is authenticated, let them stay
  // No automatic redirects - users can choose where to go

  // Protected paths that require authentication
  const protectedPaths = ['/booking', '/orders', '/profile', '/admin', '/provider'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  // If accessing protected path and user is not authenticated, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing admin paths, check role
  if (pathname.startsWith('/admin') && token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded && !['super_admin', 'admin'].includes(decoded.role)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If accessing provider paths, check role
  if (pathname.startsWith('/provider') && token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded && decoded.role !== 'service_provider') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
