import authConfig from '@/lib/auth/auth.config';
import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest) => {
  const isAuth = !!req.auth;

  const path = req.nextUrl.pathname;

  const isAuthPage =
    path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/forgot-password') || path.startsWith('/reset-password');

  const isDashboardPage = path.startsWith('/dashboard');

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
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
