import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for authentication and route protection
 *
 * This middleware demonstrates:
 * - Route protection based on authentication status
 * - Cookie-based session management
 * - Redirect logic for protected routes
 * - Middleware execution timing and constraints
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log middleware execution for demonstration
  console.log(`Middleware executing for: ${pathname}`);

  // Check if this is a protected route
  const isProtectedRoute = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/auth/protected');

  // Check for authentication cookie
  const authToken = request.cookies.get('auth-token')?.value;

  // For demonstration, we'll consider the user authenticated if:
  // 1. They have an auth token, OR
  // 2. They're accessing the login page
  const isAuthenticated = !!authToken || pathname === '/auth/login';

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    // User is trying to access a protected route without authentication
    console.log(`Unauthorized access attempt to: ${pathname}`);

    // Redirect to login page with return URL
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated but trying to access login page,
  // redirect to dashboard (optional pattern)
  if (pathname === '/auth/login' && authToken) {
    console.log('Authenticated user accessing login page, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // For all other cases, continue with the request
  console.log(`Allowing access to: ${pathname}`);
  return NextResponse.next();
}

/**
 * Middleware Configuration
 *
 * This defines which routes the middleware should run on.
 * Using a matcher allows for more precise control than running
 * middleware on every request.
 */
export const config = {
  matcher: [
    // Match all routes except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',

    // Specifically include auth and dashboard routes
    '/auth/:path*',
    '/dashboard/:path*',
  ],
};
