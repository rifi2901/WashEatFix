import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Proteksi rute /admin (kecuali halaman login /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session')?.value;

    if (!session || session !== 'kbt_session_token_2026') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Hanya jalankan middleware/proxy untuk rute /admin dan sub-rutenya
export const config = {
  matcher: ['/admin/:path*']
};
