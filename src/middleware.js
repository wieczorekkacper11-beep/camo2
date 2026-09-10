import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('camo_admin_session')?.value;

  // Trasy panelu admina
  if (pathname.startsWith('/admin')) {
    // Ekran logowania
    if (pathname === '/admin/login') {
      if (sessionToken) {
        // Jeśli jest już zalogowany, przenieś do dashboardu
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Pozostałe podstrony /admin wymagają sesji
    if (!sessionToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
