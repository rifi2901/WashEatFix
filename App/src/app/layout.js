import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Wash Eat Fix - Premium Automotive Service, Wash & Cafe",
  description: "Platform servis otomotif modern yang memadukan perawatan bengkel berkualitas, car wash canggih, dan ruang tunggu nyaman bergaya cafe.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main style={{ flex: 1, minHeight: 'calc(100vh - 160px)' }}>
          {children}
        </main>
        
        <footer style={{
          borderTop: '1px solid var(--border-color)',
          background: '#070709',
          padding: '40px 0',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          marginTop: '60px'
        }}>
          <div className="container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <p style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.05em' }}>
                WASH EAT FIX
              </p>
              <p style={{ fontSize: '0.85rem' }}>Integrated Automotive Service & Waiting Lounge Cafe</p>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem' }}>&copy; 2026 Wash Eat Fix. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
