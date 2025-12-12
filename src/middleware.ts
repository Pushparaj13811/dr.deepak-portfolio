import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isAdminApi = request.nextUrl.pathname.startsWith('/api/admin');
  const isAuthApi = request.nextUrl.pathname === '/api/admin/login';

  // Allow login API always
  if (isAuthApi) {
    return NextResponse.next();
  }

  // Protect admin API routes
  if (isAdminApi && !sessionCookie) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Redirect to login if accessing admin without session
  if (isAdminRoute && !isLoginPage && !sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirect to dashboard if already logged in and accessing login page
  if (isLoginPage && sessionCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
