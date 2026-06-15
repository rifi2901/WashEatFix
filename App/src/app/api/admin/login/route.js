import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === 'admin' && password === 'admin123') {
      const cookieStore = await cookies();
      
      // Set secure HttpOnly cookie
      cookieStore.set({
        name: 'admin_session',
        value: 'kbt_session_token_2026',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 3600 * 24 // 1 Day
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Username atau Password salah.' }, { status: 401 });
  } catch (error) {
    console.error('API Login Error:', error);
    return NextResponse.json({ error: 'Gagal melakukan login.' }, { status: 500 });
  }
}
