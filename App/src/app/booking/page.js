'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Booking() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Form States
  const [serviceType, setServiceType] = useState('Workshop Service (Ganti Oli + Filter)');
  const [vehicleType, setVehicleType] = useState('Car (SUV/Sedan)');
  const [plateNumber, setPlateNumber] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');

  // Service options
  const services = [
    { 
      id: 's1', 
      title: 'Workshop Service (Ganti Oli + Filter)', 
      description: 'Pengecekan mesin berkala, penggantian oli mesin berkualitas, dan penggantian filter oli.',
      price: 150000, 
      duration: '60 Menit',
      icon: '🔧'
    },
    { 
      id: 's2', 
      title: 'Carwash (Premium)', 
      description: 'Pencucian detail luar-dalam mobil dengan wax pelindung cat premium dan vacuum interior.',
      price: 60000, 
      duration: '45 Menit',
      icon: '🚿'
    },
    { 
      id: 's3', 
      title: 'Bundling (Service Berkala + Wash)', 
      description: 'Paket kombinasi servis mesin berkala + cuci premium luar-dalam. Hemat waktu dan biaya.',
      price: 190000, 
      duration: '90 Menit',
      icon: '📦'
    }
  ];

  const activeServiceInfo = services.find(s => s.title.startsWith(serviceType.split(' ')[0])) || services[0];

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!plateNumber || !scheduleDate || !scheduleTime) {
        setError('Mohon isi nomor pelat kendaraan, tanggal, dan jam servis.');
        return;
      }
      setError('');
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !phone) {
      setError('Mohon isi nama lengkap dan nomor telepon Anda.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          phone,
          plateNumber,
          vehicleType,
          serviceType,
          scheduleDate,
          scheduleTime,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat mendaftar.');
      }

      setSuccessData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
      
      {/* Progress indicators */}
      {!successData && (
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-line"></div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="step-line"></div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
          <style jsx>{`
            .step-indicator {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 40px;
            }
            .step-dot {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: 2px solid rgba(255,255,255,0.15);
              background: var(--bg-main);
              color: var(--text-muted);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              transition: var(--transition-smooth);
            }
            .step-dot.active {
              border-color: var(--accent-orange);
              color: var(--text-primary);
              box-shadow: var(--glow-shadow-orange);
            }
            .step-line {
              flex: 1;
              max-width: 100px;
              height: 2px;
              background: rgba(255,255,255,0.1);
            }
          `}</style>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <style jsx>{`
            .error-banner {
              background: rgba(239, 68, 68, 0.1);
              border: 1px solid rgba(239, 68, 68, 0.3);
              color: #f87171;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 24px;
              font-size: 0.9rem;
            }
          `}</style>
        </div>
      )}

      {/* Success State */}
      {successData ? (
        <div className="card card-orange success-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div className="success-icon">✓</div>
          <h2>Booking Sukses Terdaftar!</h2>
          <p style={{ margin: '16px 0 32px 0' }}>
            Tiket antrean kendaraan Anda telah berhasil dibuat. Silakan tunjukkan detail di bawah ini saat tiba di lokasi.
          </p>

          <div className="ticket-details">
            <div className="ticket-row">
              <span className="t-label">ID BOOKING</span>
              <span className="t-val font-mono">{successData.id}</span>
            </div>
            <div className="ticket-row">
              <span className="t-label">NOMOR ANTREAN</span>
              <span className="t-val queue-num font-mono">#{successData.queueNumber}</span>
            </div>
            <div className="ticket-row">
              <span className="t-label">NAMA</span>
              <span className="t-val">{successData.customerName}</span>
            </div>
            <div className="ticket-row">
              <span className="t-label">NO. PELAT</span>
              <span className="t-val font-mono">{successData.plateNumber}</span>
            </div>
            <div className="ticket-row">
              <span className="t-label">JADWAL</span>
              <span className="t-val">{successData.scheduleDate} pada pukul {successData.scheduleTime}</span>
            </div>
          </div>

          <div className="success-actions" style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href={`/tracking?plate=${successData.plateNumber}`} className="btn btn-blue">
              Pantau Progress Kendaraan
            </Link>
            <Link href="/" className="btn btn-secondary">
              Kembali ke Beranda
            </Link>
          </div>

          <style jsx>{`
            .success-icon {
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background: var(--accent-orange);
              color: white;
              font-size: 2rem;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 24px auto;
              box-shadow: var(--glow-shadow-orange);
            }
            .ticket-details {
              background: rgba(0,0,0,0.3);
              border: 1px solid var(--border-color);
              border-radius: 12px;
              padding: 24px;
              max-width: 500px;
              margin: 0 auto;
              text-align: left;
            }
            .ticket-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid rgba(255,255,255,0.05);
            }
            .ticket-row:last-child {
              border-bottom: none;
            }
            .t-label {
              font-size: 0.8rem;
              color: var(--text-muted);
              font-weight: 600;
              letter-spacing: 0.05em;
            }
            .t-val {
              font-weight: 700;
              color: var(--text-primary);
            }
            .queue-num {
              color: var(--accent-orange);
              font-size: 1.25rem;
            }
          `}</style>
        </div>
      ) : (
        /* Form Multi Step */
        <form onSubmit={handleSubmit} className="card card-blue booking-form">
          <h2 style={{ marginBottom: '8px' }}>Formulir Reservasi Layanan</h2>
          <p style={{ marginBottom: '32px', fontSize: '0.9rem' }}>Langkah {step} dari 3: {step === 1 ? 'Pilih Layanan' : step === 2 ? 'Detail Kendaraan & Jadwal' : 'Data Diri & Konfirmasi'}</p>

          {/* STEP 1: SELECT SERVICE */}
          {step === 1 && (
            <div className="form-step">
              <label style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Pilih Kategori Layanan:</label>
              <div className="service-options-container">
                {services.map((item) => (
                  <div 
                    key={item.id}
                    className={`service-option-card ${serviceType.startsWith(item.title.split(' ')[0]) ? 'selected' : ''}`}
                    onClick={() => setServiceType(item.title)}
                  >
                    <div className="option-icon">{item.icon}</div>
                    <div className="option-info">
                      <h4>{item.title}</h4>
                      <p style={{ fontSize: '0.85rem', margin: '4px 0 12px 0' }}>{item.description}</p>
                      <div className="option-meta">
                        <span className="opt-price">Rp {item.price.toLocaleString('id-ID')}</span>
                        <span className="opt-duration">⏱️ {item.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-actions" style={{ marginTop: '32px', textAlign: 'right' }}>
                <button type="button" className="btn btn-blue" onClick={handleNextStep}>
                  Lanjut ke Jadwal &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VEHICLE DETAILS & SCHEDULE */}
          {step === 2 && (
            <div className="form-step">
              <div className="grid-2" style={{ marginBottom: '20px' }}>
                <div>
                  <label htmlFor="vehicleType">Tipe Kendaraan</label>
                  <select 
                    id="vehicleType" 
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                  >
                    <option value="Car (SUV/Sedan)">Mobil (SUV / Sedan / Hatchback)</option>
                    <option value="Car (MPV/Large)">Mobil (MPV / Large Van)</option>
                    <option value="Motorcycle (Under 250cc)">Motor (Bebek / Matic / Naked &lt; 250cc)</option>
                    <option value="Motorcycle (Over 250cc)">Motor (Sport / Matic Bongsor &gt; 250cc)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="plateNumber">Nomor Pelat Kendaraan</label>
                  <input 
                    type="text" 
                    id="plateNumber" 
                    placeholder="Contoh: B 1234 ABC"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: '24px' }}>
                <div>
                  <label htmlFor="scheduleDate">Pilih Tanggal</label>
                  <input 
                    type="date" 
                    id="scheduleDate"
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="scheduleTime">Pilih Jam</label>
                  <select 
                    id="scheduleTime" 
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Jam Kedatangan --</option>
                    <option value="08:00">08:00 WIB</option>
                    <option value="09:00">09:00 WIB</option>
                    <option value="10:00">10:00 WIB</option>
                    <option value="11:00">11:00 WIB</option>
                    <option value="13:00">13:00 WIB</option>
                    <option value="14:00">14:00 WIB</option>
                    <option value="15:00">15:00 WIB</option>
                    <option value="16:00">16:00 WIB</option>
                  </select>
                </div>
              </div>

              <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                  &larr; Kembali
                </button>
                <button type="button" className="btn btn-blue" onClick={handleNextStep}>
                  Lanjut ke Data Diri &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMER DETAILS & SUMMARY */}
          {step === 3 && (
            <div className="form-step">
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="customerName">Nama Lengkap Pemilik</label>
                <input 
                  type="text" 
                  id="customerName" 
                  placeholder="Masukkan nama lengkap Anda"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label htmlFor="phone">Nomor Telepon (WhatsApp Aktif)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              {/* Summary panel */}
              <div className="summary-panel" style={{ marginBottom: '32px' }}>
                <h4>Ringkasan Reservasi</h4>
                <div className="summary-list">
                  <div className="summary-item">
                    <span>Layanan Utama</span>
                    <strong>{serviceType}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Jenis & Pelat Kendaraan</span>
                    <strong>{vehicleType} ({plateNumber.toUpperCase()})</strong>
                  </div>
                  <div className="summary-item">
                    <span>Jadwal Kedatangan</span>
                    <strong>{scheduleDate} @ {scheduleTime} WIB</strong>
                  </div>
                  <div className="summary-item summary-total">
                    <span>Estimasi Biaya Servis</span>
                    <strong className="text-orange">Rp {activeServiceInfo.price.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Estimasi Durasi</span>
                    <strong>⏱️ {activeServiceInfo.duration}</strong>
                  </div>
                </div>
              </div>

              <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-secondary" onClick={handlePrevStep} disabled={loading}>
                  &larr; Kembali
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Mendaftarkan...' : 'Konfirmasi Booking & Buat Antrean'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
