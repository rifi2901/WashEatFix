import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOrders, addOrder, getBookingById } from '@/lib/db';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (!session || session !== 'kbt_session_token_2026') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 });
    }

    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('API Orders GET Error:', error);
    return NextResponse.json({ error: 'Gagal memuat data pesanan' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { bookingId, items, totalPrice } = body;

    if (!bookingId || !items || !Array.isArray(items) || items.length === 0 || !totalPrice) {
      return NextResponse.json({ error: 'Data pesanan tidak lengkap.' }, { status: 400 });
    }

    // Validasi booking
    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Data registrasi kendaraan tidak ditemukan.' }, { status: 404 });
    }

    // Validasi status kendaraan (hanya bisa pesan jika statusnya In Progress, Washing, atau Waiting)
    const allowedStatuses = ['In Progress', 'Washing', 'Waiting'];
    if (!allowedStatuses.includes(booking.status)) {
      return NextResponse.json({
        error: `Pesanan Cafe hanya dibuka saat kendaraan sedang diproses. Status saat ini: ${booking.status}`
      }, { status: 403 });
    }

    const newOrder = await addOrder({
      bookingId,
      customerName: booking.customerName,
      plateNumber: booking.plateNumber,
      items,
      totalPrice
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('API Orders POST Error:', error);
    return NextResponse.json({ error: 'Gagal membuat pesanan cafe' }, { status: 500 });
  }
}
