import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBookings, getBookingByPlate, addBooking } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const plateNumber = searchParams.get('plateNumber');

    if (plateNumber) {
      const booking = await getBookingByPlate(plateNumber);
      if (!booking) {
        return NextResponse.json({ error: 'Kendaraan tidak ditemukan' }, { status: 404 });
      }
      return NextResponse.json(booking);
    }

    // Hanya admin yang bisa memuat seluruh booking
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (!session || session !== 'kbt_session_token_2026') {
      return NextResponse.json({ error: 'Akses ditolak.' }, { status: 401 });
    }

    const bookings = await getBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('API Bookings GET Error:', error);
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, phone, plateNumber, vehicleType, serviceType, scheduleDate, scheduleTime } = body;

    if (!customerName || !phone || !plateNumber || !vehicleType || !serviceType || !scheduleDate || !scheduleTime) {
      return NextResponse.json({ error: 'Mohon lengkapi semua data booking.' }, { status: 400 });
    }
    
    const newBooking = await addBooking({
      customerName,
      phone,
      plateNumber,
      vehicleType,
      serviceType,
      scheduleDate,
      scheduleTime
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('API Bookings POST Error:', error);
    const message = error.message || 'Gagal membuat booking';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
