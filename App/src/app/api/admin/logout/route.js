import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Delete session cookie
    cookieStore.delete('admin_session');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Logout Error:', error);
    return NextResponse.json({ error: 'Gagal melakukan logout.' }, { status: 500 });
  }
}
