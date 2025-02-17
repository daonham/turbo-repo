import { getSessionCookie } from 'better-auth';
import { NextResponse, type NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some((p) => path.startsWith(p));
  const isDashboardPage = path.startsWith('/dashboard');

  if (isAuthPage || isDashboardPage) {
    const isAuth = getSessionCookie(req);

    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!isAuth && isDashboardPage) {
      let from = path;

      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
