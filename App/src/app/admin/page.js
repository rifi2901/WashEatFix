'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'orders'

  // Load dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [bRes, oRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/orders')
      ]);

      if (bRes.status === 401 || oRes.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!bRes.ok || !oRes.ok) {
        throw new Error('Gagal memuat data dari server API.');
      }

      const bData = await bRes.json();
      const oData = await oRes.json();

      setBookings(bData);
      setOrders(oData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', {
        method: 'POST'
      });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      } else {
        throw new Error('Gagal melakukan logout.');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal memperbarui status.');
      }

      // Update state local
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Update Cafe Order Status
  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal memperbarui status pesanan.');
      }

      // Update state local
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Calculate statistics
  const totalBookings = bookings.length;
  const activeQueues = bookings.filter(b => ['Queue', 'In Progress', 'Washing', 'Waiting'].includes(b.status)).length;
  const totalOrders = orders.length;

  const estimateRevenue = () => {
    const servicePriceMap = {
      'Workshop Service': 150000,
      'Carwash': 60000,
      'Bundling': 190000
    };

    const serviceRev = bookings.reduce((sum, b) => {
      const nameKey = Object.keys(servicePriceMap).find(k => b.serviceType.startsWith(k));
      const price = nameKey ? servicePriceMap[nameKey] : 150000;
      return sum + price;
    }, 0);

    const cafeRev = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    return serviceRev + cafeRev;
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      
      {/* Top Banner Header */}
      <div className="dashboard-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Dashboard Operasional Admin</h2>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Pantau antrean bengkel, carwash, dan proses pemesanan cafe di satu layar terintegrasi.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={fetchDashboardData} 
            className="btn btn-blue"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            disabled={loading}
          >
            🔄 Segarkan Data
          </button>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: '#ef4444', color: '#f87171' }}
          >
            🚪 Keluar (Logout)
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW PANEL */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
          <span className="stat-label">Total Booking Masuk</span>
          <span className="stat-number">{totalBookings} <span className="stat-sub">Kendaraan</span></span>
        </div>

        <div className="card stat-card" style={{ borderLeft: '4px solid var(--status-waiting)' }}>
          <span className="stat-label">Antrean Aktif Saat Ini</span>
          <span className="stat-number">{activeQueues} <span className="stat-sub">Diproses</span></span>
        </div>

        <div className="card stat-card" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
          <span className="stat-label">Pesanan Lounge Cafe</span>
          <span className="stat-number">{totalOrders} <span className="stat-sub">Pemesanan</span></span>
        </div>

        <div className="card stat-card" style={{ borderLeft: '4px solid var(--status-finished)' }}>
          <span className="stat-label">Estimasi Pendapatan Harian</span>
          <span className="stat-number" style={{ fontSize: '1.4rem' }}>Rp {estimateRevenue().toLocaleString('id-ID')}</span>
        </div>

      </div>

      {/* ANALYTICS CHART PANEL */}
      <div className="card chart-panel-card" style={{ marginBottom: '32px', background: 'rgba(18, 18, 22, 0.5)' }}>
        <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📈 Analitik Kunjungan & Pendapatan Mingguan
        </h4>
        <div style={{ position: 'relative', width: '100%', height: '240px' }}>
          {/* Custom SVG Line Chart */}
          <svg viewBox="0 0 800 220" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <defs>
              {/* Blue Gradient for Service */}
              <linearGradient id="serviceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0.0" />
              </linearGradient>
              {/* Orange Gradient for Cafe */}
              <linearGradient id="cafeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-orange)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent-orange)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="50" y1="30" x2="780" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="50" y1="80" x2="780" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="50" y1="130" x2="780" y2="130" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="50" y1="180" x2="780" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* Y Axis Labels */}
            <text x="15" y="35" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Rp 500k</text>
            <text x="15" y="85" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Rp 300k</text>
            <text x="15" y="135" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Rp 100k</text>
            <text x="15" y="185" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Rp 0</text>

            {/* Service Area & Line (Blue) */}
            <path
              d="M 50,180 Q 170,110 290,130 T 530,90 Q 650,40 780,50 L 780,180 L 50,180 Z"
              fill="url(#serviceGrad)"
            />
            <path
              d="M 50,180 Q 170,110 290,130 T 530,90 Q 650,40 780,50"
              fill="none"
              stroke="var(--accent-blue)"
              strokeWidth="3"
            />

            {/* Cafe Area & Line (Orange) */}
            <path
              d="M 50,180 Q 170,160 290,150 T 530,140 Q 650,90 780,110 L 780,180 L 50,180 Z"
              fill="url(#cafeGrad)"
            />
            <path
              d="M 50,180 Q 170,160 290,150 T 530,140 Q 650,90 780,110"
              fill="none"
              stroke="var(--accent-orange)"
              strokeWidth="3"
            />

            {/* Node Points & Tooltips */}
            <circle cx="650" cy="40" r="5" fill="var(--accent-blue)" stroke="#ffffff" strokeWidth="2" />
            <circle cx="650" cy="90" r="5" fill="var(--accent-orange)" stroke="#ffffff" strokeWidth="2" />

            {/* X Axis Labels */}
            <text x="50" y="205" fill="var(--text-muted)" fontSize="11" textAnchor="middle">Senin</text>
            <text x="171" y="205" fill="var(--text-muted)" fontSize="11" textAnchor="middle">Selasa</text>
            <text x="292" y="205" fill="var(--text-muted)" fontSize="11" textAnchor="middle">Rabu</text>
            <text x="413" y="205" fill="var(--text-muted)" fontSize="11" textAnchor="middle">Kamis</text>
            <text x="534" y="205" fill="var(--text-muted)" fontSize="11" textAnchor="middle">Jumat</text>
            <text x="655" y="205" fill="var(--text-primary)" fontSize="11" fontWeight="bold" textAnchor="middle">Sabtu (Puncak)</text>
            <text x="776" y="205" fill="var(--text-muted)" fontSize="11" textAnchor="middle">Minggu</text>
          </svg>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '16px', justifyContent: 'center', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--accent-blue)', borderRadius: '2px' }}></span>
            <span>Pendapatan Layanan (Bengkel & Wash)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--accent-orange)', borderRadius: '2px' }}></span>
            <span>Pendapatan Café Lounge</span>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* DASHBOARD TAB CONTROLS */}
      <div className="dashboard-tabs" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '24px' }}>
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          🚘 Antrean Servis & Wash ({bookings.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          ☕ Pesanan Cafe Lounge ({orders.length})
        </button>
      </div>

      {/* TAB CONTENT: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="card data-table-card">
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama & Pelat</th>
                  <th>Tipe Kendaraan</th>
                  <th>Layanan</th>
                  <th>Jadwal Kedatangan</th>
                  <th>Status Progres</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Tidak ada data registrasi booking.</td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="font-mono" style={{ fontWeight: 'bold' }}>{b.id}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{b.customerName}</div>
                        <span className="plate-badge font-mono">{b.plateNumber}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{b.vehicleType}</td>
                      <td style={{ fontSize: '0.85rem' }}>{b.serviceType}</td>
                      <td style={{ fontSize: '0.85rem' }}>{b.scheduleDate} <br/> {b.scheduleTime} WIB</td>
                      <td>
                        <span className={`badge badge-${b.status.toLowerCase().replace(' ', '-')}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="status-selector"
                        >
                          <option value="Queue">Queue (Antrean)</option>
                          <option value="In Progress">In Progress (Servis)</option>
                          <option value="Washing">Washing (Cuci)</option>
                          <option value="Waiting">Waiting (Lounge)</option>
                          <option value="Finished">Finished (Selesai)</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="card data-table-card">
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID Order</th>
                  <th>ID Booking</th>
                  <th>Nama & Pelat</th>
                  <th>Item Pesanan</th>
                  <th>Total Harga</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>Belum ada pesanan cafe masuk.</td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id}>
                      <td className="font-mono" style={{ fontWeight: 'bold' }}>{o.id}</td>
                      <td className="font-mono">{o.bookingId}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{o.customerName}</div>
                        <span className="plate-badge font-mono">{o.plateNumber}</span>
                      </td>
                      <td>
                        <div className="ordered-items-cell">
                          {o.items.map((it, idx) => (
                            <div key={idx} style={{ fontSize: '0.8rem' }}>
                              🍪 {it.name} x<strong>{it.quantity}</strong>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="font-mono" style={{ fontWeight: 'bold', color: 'var(--accent-orange)' }}>
                        Rp {o.totalPrice.toLocaleString('id-ID')}
                      </td>
                      <td>
                        <span className={`order-badge order-badge-${o.status.toLowerCase()}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="status-selector"
                        >
                          <option value="Pending">Pending (Masuk)</option>
                          <option value="Preparing">Preparing (Dibuat)</option>
                          <option value="Ready">Ready (Siap Antar)</option>
                          <option value="Delivered">Delivered (Selesai)</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
