'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Daftar Menu (Sama seperti di db.js)
const CAFE_MENU = [
  { id: 'm1', name: 'Es Kopi Susu Aren', category: 'Coffee', price: 18000, description: 'Espresso dengan susu segar dan gula aren murni.', icon: '☕' },
  { id: 'm2', name: 'Caramel Macchiato', category: 'Coffee', price: 25000, description: 'Kopi susu dengan sirup karamel manis gurih.', icon: '☕' },
  { id: 'm3', name: 'Ice Lemon Tea', category: 'Non-Coffee', price: 12000, description: 'Teh lemon segar dengan es batu.', icon: '🍹' },
  { id: 'm4', name: 'Matcha Latte', category: 'Non-Coffee', price: 22000, description: 'Teh matcha Jepang berkualitas dengan susu.', icon: '🍵' },
  { id: 'm5', name: 'Roti Bakar Cokelat Keju', category: 'Snack', price: 15000, description: 'Roti panggang mentega dengan topping cokelat mesis dan keju parut.', icon: '🍞' },
  { id: 'm6', name: 'French Fries', category: 'Snack', price: 14000, description: 'Kentang goreng renyah dengan taburan garam gurih.', icon: '🍟' },
];

function CafeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId') || '';

  const [inputBookingId, setInputBookingId] = useState(bookingId);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Cart State
  const [cart, setCart] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (bookingId) {
      validateBooking(bookingId);
    }
  }, [bookingId]);

  const validateBooking = async (id) => {
    setLoading(true);
    setError('');
    setBooking(null);
    setOrderSuccess(null);

    try {
      // Ambil seluruh booking dan cari yang sesuai id
      const response = await fetch('/api/bookings');
      const bookings = await response.json();
      
      const found = bookings.find(b => b.id.toUpperCase() === id.trim().toUpperCase());
      if (!found) {
        throw new Error('Kode Booking tidak terdaftar di sistem kami.');
      }
      
      // Validasi status pengerjaan
      const allowedStatuses = ['In Progress', 'Washing', 'Waiting'];
      if (!allowedStatuses.includes(found.status)) {
        throw new Error(`Pemesanan Cafe tidak diizinkan untuk kendaraan dengan status "${found.status}". Layanan cafe hanya untuk pelanggan yang kendaraannya sedang dikerjakan.`);
      }

      setBooking(found);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!inputBookingId.trim()) return;
    
    const params = new URLSearchParams(window.location.search);
    params.set('bookingId', inputBookingId.trim().toUpperCase());
    router.push(`/cafe?${params.toString()}`);
    
    validateBooking(inputBookingId);
  };

  // Cart Functions
  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, change) => {
    const existing = cart.find(c => c.id === itemId);
    if (!existing) return;
    
    const newQty = existing.quantity + change;
    if (newQty <= 0) {
      setCart(cart.filter(c => c.id !== itemId));
    } else {
      setCart(cart.map(c => c.id === itemId ? { ...c, quantity: newQty } : c));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || !booking) return;
    
    setPlacingOrder(true);
    setError('');

    try {
      const orderItems = cart.map(item => ({
        menuId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          items: orderItems,
          totalPrice: getCartTotal()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengirim pesanan.');
      }

      setOrderSuccess(data);
      setCart([]); // Kosongkan cart
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const filteredMenu = activeCategory === 'All' 
    ? CAFE_MENU 
    : CAFE_MENU.filter(item => item.category === activeCategory);

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      
      {/* HEADER SECTION */}
      <div className="cafe-header card card-orange" style={{ marginBottom: '40px', padding: '40px' }}>
        <span className="badge badge-waiting" style={{ marginBottom: '16px' }}>SUPPORTING SERVICE</span>
        <h2>Wash Eat Fix Waiting Lounge Cafe</h2>
        <p style={{ marginTop: '8px', maxWidth: '650px' }}>
          Layanan eksklusif untuk menemani waktu tunggu Anda. Pesanan kopi, teh, dan makanan ringan Anda akan langsung diantarkan ke meja tunggu Lounge oleh staf kami.
        </p>
      </div>

      {/* CASE 1: NO VALID BOOKING ID */}
      {!booking && !loading && (
        <div className="booking-validator-container card card-blue" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>☕</span>
          <h3 style={{ margin: '16px 0 8px 0' }}>Akses Layanan Cafe</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>
            Untuk memesan hidangan Cafe, harap masukkan **Kode Booking** kendaraan Anda yang aktif (Status: In Progress / Washing / Waiting).
          </p>
          
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleBookingSubmit} style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <input 
              type="text" 
              placeholder="Contoh: BKG-002"
              value={inputBookingId}
              onChange={(e) => setInputBookingId(e.target.value)}
              style={{ maxWidth: '250px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}
              required
            />
            <button type="submit" className="btn btn-blue">
              Validasi Kode
            </button>
          </form>
          <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Belum booking kendaraan? <Link href="/booking" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>Daftar di sini &rarr;</Link>
          </div>
        </div>
      )}

      {/* CASE 2: LOADING */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '16px' }}>Memverifikasi status antrean Anda...</p>
          <style jsx>{`
            .spinner {
              width: 40px;
              height: 40px;
              border: 3px solid rgba(255,255,255,0.1);
              border-radius: 50%;
              border-top-color: var(--accent-orange);
              animation: spin 1s ease-in-out infinite;
              margin: 0 auto;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {/* CASE 3: ACTIVE BOOKING - CAFE MENU IS OPEN */}
      {booking && !loading && (
        <div className="cafe-workspace">
          
          {/* Active Customer Status Bar */}
          <div className="card customer-status-bar" style={{ marginBottom: '32px', borderLeft: '4px solid var(--accent-orange)' }}>
            <div className="status-bar-grid">
              <div>
                <span className="lbl">MEJA TUNGGU PELANGGAN</span>
                <span className="val">{booking.customerName} ({booking.plateNumber})</span>
              </div>
              <div>
                <span className="lbl">STATUS KENDARAAN</span>
                <span className={`badge badge-${booking.status.toLowerCase().replace(' ', '-')}`}>{booking.status}</span>
              </div>
              <div>
                <span className="lbl">KODE BOOKING</span>
                <span className="val font-mono">{booking.id}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Link href={`/tracking?plate=${booking.plateNumber}`} style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: '600' }}>
                  ⚙️ Monitor Progres &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Success Order Overlay */}
          {orderSuccess && (
            <div className="card order-success-card" style={{ marginBottom: '32px', textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <h3 style={{ color: 'var(--status-finished)', margin: '8px 0' }}>Pesanan Café Dikirim!</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
                Pesanan Anda dengan kode <strong>{orderSuccess.id}</strong> senilai Rp {orderSuccess.totalPrice.toLocaleString('id-ID')} telah masuk ke sistem barista kami.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Silakan tetap berada di ruang tunggu, pesanan akan segera diantarkan ke meja Anda.
              </p>
            </div>
          )}

          {/* Main Grid: Menu & Cart */}
          <div className="cafe-grid">
            
            {/* Menu List Column */}
            <div className="menu-column">
              
              {/* Category Filter Tab */}
              <div className="category-tabs" style={{ marginBottom: '24px' }}>
                {['All', 'Coffee', 'Non-Coffee', 'Snack'].map((cat) => (
                  <button 
                    key={cat} 
                    className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div className="menu-list-grid">
                {filteredMenu.map((item) => (
                  <div key={item.id} className="card menu-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="menu-icon">{item.icon}</span>
                      <span className="menu-price">Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>
                    <h4 style={{ margin: '12px 0 6px 0', fontSize: '1.05rem' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.8rem', minHeight: '48px', overflow: 'hidden' }}>{item.description}</p>
                    
                    <button 
                      onClick={() => addToCart(item)}
                      className="btn btn-secondary" 
                      style={{ width: '100%', marginTop: '16px', padding: '8px 12px', fontSize: '0.85rem' }}
                    >
                      + Tambah ke Keranjang
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Column */}
            <div className="cart-column">
              <div className="card cart-card" style={{ borderTop: '4px solid var(--accent-orange)' }}>
                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>Keranjang Belanja</h3>
                
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    <span style={{ fontSize: '2rem' }}>🛒</span>
                    <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>Keranjang masih kosong.</p>
                  </div>
                ) : (
                  <>
                    <div className="cart-items-list">
                      {cart.map((item) => (
                        <div key={item.id} className="cart-item-row">
                          <div className="cart-item-info">
                            <span className="cart-item-name">{item.name}</span>
                            <span className="cart-item-price">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                          </div>
                          <div className="cart-quantity-controls">
                            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cart-summary-totals">
                      <div className="total-row">
                        <span>Subtotal</span>
                        <span>Rp {getCartTotal().toLocaleString('id-ID')}</span>
                      </div>
                      <div className="total-row grand-total">
                        <span>Total Bayar</span>
                        <span className="text-orange">Rp {getCartTotal().toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                      className="btn btn-primary" 
                      style={{ width: '100%', marginTop: '24px' }}
                    >
                      {placingOrder ? 'Memproses...' : 'Kirim Pesanan ke Barista'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Cafe() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>Memuat Cafe...</div>}>
      <CafeContent />
    </Suspense>
  );
}
