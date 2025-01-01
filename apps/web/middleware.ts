import type { auth } from '@/lib/auth';
import { NextResponse, type NextRequest } from 'next/server';

type Session = typeof auth.$Infer.Session;

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some((p) => path.startsWith(p));
  const isDashboardPage = path.startsWith('/dashboard');

  const res = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
    headers: {
      cookie: req.headers.get('cookie') || ''
    }
  });

  const isAuth = await res.json();

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

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
