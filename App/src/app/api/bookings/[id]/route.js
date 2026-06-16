import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateBookingStatus, getBookingById } from '@/lib/db';

// GET: Ambil data booking berdasarkan ID (publik, tidak perlu login admin)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error) {
    console.error('API Booking GET by ID Error:', error);
    return NextResponse.json({ error: 'Gagal memuat data booking' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;

    if (!session || session !== 'kbt_session_token_2026') {
      return NextResponse.json({ error: 'Akses ditolak. Silakan login sebagai admin.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status harus diisi' }, { status: 400 });
    }

    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 });
    }

    const updated = await updateBookingStatus(id, status);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('API Bookings PATCH Error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui status' }, { status: 500 });
  }
}
