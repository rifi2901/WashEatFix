import Link from 'next/link';

export default function Home() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span> INTEGRATED AUTOMOTIVE SERVICE
            </div>
            <h1>
              Servis Otomotif Premium. <br />
              <span className="highlight-text">Tunggu dengan Nyaman.</span>
            </h1>
            <p>
              Bebaskan diri dari waktu tunggu bengkel yang membosankan. Booking servis kendaraan atau car wash premium secara online, dan nikmati kenyamanan Lounge Cafe kami selagi tim ahli kami bekerja.
            </p>
            <div className="hero-actions">
              <Link href="/booking" className="btn btn-primary">
                Booking Servis Now
              </Link>
              <Link href="/tracking" className="btn btn-secondary">
                Pantau Progress
              </Link>
            </div>
          </div>
          
          {/* Visual Showcase (Virtual dashboard/car chassis) */}
          <div className="hero-visual">
            <div className="visual-card card animate-glow-blue">
              <div className="visual-header">
                <span className="visual-dot"></span>
                <span className="visual-title">WEF MONITORING SYSTEM v1.0</span>
              </div>
              <div className="visual-body">
                <div className="visual-stat-row">
                  <div>
                    <span className="stat-label">Slot Hari Ini</span>
                    <span className="stat-value">Tersedia</span>
                  </div>
                  <div>
                    <span className="stat-label">Antrean Aktif</span>
                    <span className="stat-value text-blue">4 Kendaraan</span>
                  </div>
                </div>
                
                {/* Virtual tracking UI */}
                <div className="mock-tracker">
                  <div className="mock-tracker-header">
                    <span className="plate-tag">D 9999 XYZ</span>
                    <span className="status-tag">On Service</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span className="progress-time">Estimasi Selesai: 25 Menit</span>
                </div>

                <div className="cafe-teaser-card">
                  <div className="cafe-teaser-header">
                    <span className="cafe-tag">Waiting Cafe Lounge</span>
                  </div>
                  <p className="cafe-teaser-text">Menu Kopi Susu Aren & Snack Siap Dipesan Saat Kendaraan Diproses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section container">
        <div className="section-header">
          <h2>Layanan Utama Kami</h2>
          <p>Dikerjakan oleh mekanik berpengalaman dengan peralatan diagnostik modern.</p>
        </div>

        <div className="grid-3">
          <div className="card card-blue service-card">
            <div className="service-icon">🔧</div>
            <h3>Workshop Service</h3>
            <p>Perawatan berkala, perbaikan mesin, ganti oli, tune-up, hingga diagnostik kelistrikan komputerisasi.</p>
            <ul className="service-list">
              <li>Peralatan diagnostik OBD-II</li>
              <li>Mekanik bersertifikasi</li>
              <li>Suku cadang orisinal berkualitas</li>
            </ul>
          </div>

          <div className="card card-blue service-card">
            <div className="service-icon">🚿</div>
            <h3>Premium Car Wash</h3>
            <p>Pencucian mobil detail luar dan dalam menggunakan wax premium, perlindungan cat, dan vacum karpet.</p>
            <ul className="service-list">
              <li>Shampoo pH balanced</li>
              <li>Pembersihan interior detail</li>
              <li>Semir ban & pembersihan kaca</li>
            </ul>
          </div>

          <div className="card card-orange service-card">
            <div className="service-icon">📦</div>
            <h3>Bundling Package</h3>
            <p>Paket komplit hemat yang menggabungkan servis berkala kendaraan dengan cuci premium dalam satu kunjungan.</p>
            <ul className="service-list">
              <li>Lebih cepat & efisien</li>
              <li>Diskon paket hingga 20%</li>
              <li>Free 1x Americano / Ice Tea</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Lounge Teaser Section */}
      <section className="lounge-section">
        <div className="container lounge-grid">
          <div className="lounge-image-showcase">
            <div className="lounge-card card">
              <span className="lounge-badge">SUPPORTING SERVICE</span>
              <h3>Premium Waiting Lounge Cafe</h3>
              <p>
                Kami percaya waktu tunggu Anda sangat berharga. Sembari menunggu kendaraan dikerjakan, nikmati fasilitas ruang tunggu bergaya cafe modern:
              </p>
              <ul className="lounge-features">
                <li>☕ <strong>Kopi Spesialitas:</strong> Espresso, Latte, & aneka kopi susu buatan barista kami.</li>
                <li>⚡ <strong>Work-Friendly:</strong> Colokan listrik di setiap meja & Wi-Fi kecepatan tinggi.</li>
                <li>🛋️ <strong>Kursi Ergonomis:</strong> Sofa empuk dan lingkungan ber-AC bersih dari bau oli/bengkel.</li>
                <li>📱 <strong>Pesan via Web:</strong> Pesan kopi dan roti panggang langsung dari meja tunggu Anda.</li>
              </ul>
            </div>
          </div>
          <div className="lounge-content">
            <span className="subtitle">WAITING EXPERIENCE</span>
            <h2>Bekerja atau Santai Saat Servis Berlangsung</h2>
            <p style={{ marginBottom: '24px' }}>
              Tidak perlu lagi duduk di kursi plastik panas atau menghirup asap kendaraan. Lounge Cafe kami terisolasi dengan baik dengan sekat kaca kedap suara, memungkinkan Anda tetap produktif membalas email kerja atau bersantai membaca buku.
            </p>
            <div className="lounge-note">
              <strong>Catatan Penting:</strong> Layanan pemesanan cafe diaktifkan khusus melalui halaman pemantauan (tracking) setelah kendaraan Anda masuk ke antrean pengerjaan bengkel atau pencucian.
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container" style={{ margin: '40px auto' }}>
        <div className="promo-banner card card-orange">
          <div className="promo-content">
            <span className="promo-tag">PROMO TERBATAS</span>
            <h2>Diskon 15% untuk Booking Online Pertama Anda!</h2>
            <p>Gunakan kode promo di bawah saat pembayaran atau tunjukkan ke kasir saat check-in.</p>
            <div className="promo-code">WEFFIRST2026</div>
          </div>
        </div>
      </section>
    </div>
  );
}
