'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function TrackerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlPlate = searchParams.get('plate') || '';

  const [plateNumber, setPlateNumber] = useState(urlPlate);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (urlPlate) {
      fetchTrackingData(urlPlate);
    }
  }, [urlPlate]);

  const fetchTrackingData = async (plate) => {
    if (!plate.trim()) return;
    setLoading(true);
    setError('');
    setBooking(null);
    setIsSearching(true);

    try {
      const response = await fetch(`/api/bookings?plateNumber=${encodeURIComponent(plate.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kendaraan tidak ditemukan dalam daftar antrean.');
      }

      setBooking(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;

    // Update URL query parameter
    const params = new URLSearchParams(window.location.search);
    params.set('plate', plateNumber.toUpperCase());
    router.push(`/tracking?${params.toString()}`);

    fetchTrackingData(plateNumber);
  };

  // Helper untuk menentukan persentase progres bar berdasarkan status
  const getProgressPercentage = (status) => {
    switch (status) {
      case 'Queue': return 10;
      case 'In Progress': return 35;
      case 'Washing': return 60;
      case 'Waiting': return 85;
      case 'Finished': return 100;
      default: return 0;
    }
  };

  const currentProgress = booking ? getProgressPercentage(booking.status) : 0;

  // Cek apakah user boleh memesan cafe (status: In Progress, Washing, Waiting)
  const isCafeOrderAllowed = booking && ['In Progress', 'Washing', 'Waiting'].includes(booking.status);

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '900px' }}>

      {/* Search Section */}
      <div className="card card-blue search-card" style={{ marginBottom: '40px' }}>
        <h3>Pantau Status Kendaraan</h3>
        <p style={{ margin: '8px 0 20px 0', fontSize: '0.9rem' }}>Masukkan nomor pelat kendaraan Anda untuk melihat progres servis secara real-time.</p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Contoh: D 9999 XYZ"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            style={{ flex: 1, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}
            required
          />
          <button type="submit" className="btn btn-blue" disabled={loading}>
            {loading ? 'Mencari...' : 'Cari'}
          </button>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px' }}>Menghubungkan ke sistem Wash Eat Fix...</p>
          <style jsx>{`
            .spinner {
              width: 40px;
              height: 40px;
              border: 3px solid rgba(255,255,255,0.1);
              border-radius: 50%;
              border-top-color: var(--accent-blue);
              animation: spin 1s ease-in-out infinite;
              margin: 0 auto;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="card" style={{ borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)' }}>
          <h4 style={{ color: '#f87171' }}>Pencarian Gagal</h4>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {/* Booking Data Display & Tracker */}
      {booking && !loading && (
        <div className="tracking-results">

          {/* Main Info Card */}
          <div className="card card-blue info-summary-card" style={{ marginBottom: '24px' }}>
            <div className="info-grid">
              <div>
                <span className="label">PEMILIK KENDARAAN</span>
                <span className="value">{booking.customerName}</span>
              </div>
              <div>
                <span className="label">PELAT KENDARAAN</span>
                <span className="value font-mono">{booking.plateNumber}</span>
              </div>
              <div>
                <span className="label">JENIS LAYANAN</span>
                <span className="value">{booking.serviceType}</span>
              </div>
              <div>
                <span className="label">NOMOR ANTREAN</span>
                <span className="value font-mono text-orange">#{booking.queueNumber}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <span className="label" style={{ display: 'inline', marginRight: '8px' }}>STATUS AKTIF:</span>
                <span className={`badge badge-${booking.status.toLowerCase().replace(' ', '-')}`}>
                  {booking.status}
                </span>
              </div>
              <button
                onClick={() => fetchTrackingData(booking.plateNumber)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                🔄 Refresh Status
              </button>
            </div>
          </div>

          {/* Visual Tracker Bar */}
          <div className="card tracker-card" style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '8px' }}>Progress Pengerjaan</h4>

            <div className="tracker-container">
              <div className="tracker-line"></div>
              <div className="tracker-progress-line" style={{ width: `${currentProgress}%` }}></div>

              {/* Step 1: Queue */}
              <div className={`tracker-step ${booking.status === 'Queue' ? 'active' : ''} ${['In Progress', 'Washing', 'Waiting', 'Finished'].includes(booking.status) ? 'completed' : ''}`}>
                <div className="tracker-node">1</div>
                <div className="tracker-label">Antrean (Queue)</div>
              </div>

              {/* Step 2: On Service */}
              <div className={`tracker-step ${booking.status === 'In Progress' ? 'active' : ''} ${['Washing', 'Waiting', 'Finished'].includes(booking.status) ? 'completed' : ''}`}>
                <div className="tracker-node">2</div>
                <div className="tracker-label">Pengerjaan Bengkel</div>
              </div>

              {/* Step 3: Washing */}
              <div className={`tracker-step ${booking.status === 'Washing' ? 'active' : ''} ${['Waiting', 'Finished'].includes(booking.status) ? 'completed' : ''}`}>
                <div className="tracker-node">3</div>
                <div className="tracker-label">Cuci Mobil</div>
              </div>

              {/* Step 4: Waiting */}
              <div className={`tracker-step waiting-node ${booking.status === 'Waiting' ? 'active' : ''} ${['Finished'].includes(booking.status) ? 'completed' : ''}`}>
                <div className="tracker-node">4</div>
                <div className="tracker-label">Lounge Cafe</div>
              </div>

              {/* Step 5: Finished */}
              <div className={`tracker-step ${booking.status === 'Finished' ? 'active' : ''}`}>
                <div className="tracker-node">5</div>
                <div className="tracker-label">Selesai</div>
              </div>
            </div>

            <div className="tracker-footer-notes" style={{ marginTop: '20px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.85rem' }}>
              {booking.status === 'Queue' && (
                <p>Kendaraan Anda sedang dalam antrean kedatangan awal. Silakan lakukan check-in di front office saat Anda tiba di Wash Eat Fix.</p>
              )}
              {booking.status === 'In Progress' && (
                <p>Mekanik kami sedang mengerjakan servis berkala mesin kendaraan Anda. Semua progres teratur sesuai standar operasional.</p>
              )}
              {booking.status === 'Washing' && (
                <p>Servis mekanik selesai! Kendaraan Anda kini dipindahkan ke area Carwash Premium untuk dibersihkan secara menyeluruh.</p>
              )}
              {booking.status === 'Waiting' && (
                <p className="text-orange"><strong>Selesai Diproses!</strong> Kendaraan Anda sudah diparkir aman di area penyerahan. Kami mengundang Anda menuju kasir untuk serah terima kunci dan penyelesaian administrasi.</p>
              )}
              {booking.status === 'Finished' && (
                <p style={{ color: 'var(--status-finished)', fontWeight: '600' }}>Kendaraan telah diserahterimakan dan transaksi selesai. Terima kasih telah mempercayakan kendaraan Anda pada Wash Eat Fix!</p>
              )}
            </div>
          </div>

          {/* Café Lounge Promotion Callout (Condition: In Progress, Washing, Waiting) */}
          {isCafeOrderAllowed && (
            <div className="card card-orange cafe-callout-card animate-glow-orange">
              <div className="cafe-callout-grid">
                <div className="cafe-callout-text">
                  <span className="callout-badge">FASILITAS LOUNGE CAFE</span>
                  <h3>Menunggu Dengan Santai di Cafe Kami</h3>
                  <p>
                    Selagi kendaraan Anda sedang diproses atau dibersihkan, nikmati kenyamanan di Waiting Lounge Cafe kami. Anda bisa memesan minuman segar, kopi espresso hangat, atau makanan ringan langsung dari meja Anda yang akan diantarkan oleh pramusaji kami.
                  </p>
                </div>
                <div className="cafe-callout-action">
                  <Link href={`/cafe?bookingId=${booking.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    Pesan Kopi / Makanan
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* If not searched yet */}
      {!isSearching && (
        <div className="card text-center" style={{ padding: '40px', textAlign: 'center', opacity: 0.8 }}>
          <span style={{ fontSize: '3rem' }}>🚘</span>
          <h4 style={{ margin: '16px 0 8px 0' }}>Belum ada pencarian</h4>
          <p style={{ fontSize: '0.9rem' }}>Silakan masukkan nomor pelat kendaraan Anda di atas untuk memantau status pengerjaan.</p>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>Memuat pelacak...</div>}>
      <TrackerContent />
    </Suspense>
  );
}
