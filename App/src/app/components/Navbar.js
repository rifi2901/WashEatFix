'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Book Service', path: '/booking' },
    { name: 'Track Vehicle', path: '/tracking' },
    { name: 'Lounge Cafe', path: '/cafe' },
    { name: 'Admin Portal', path: '/admin' }
  ];

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link href="/" className="logo">
          <span className="blue">Wash Eat</span>
          <span className="orange">Fix</span>
        </Link>

        {/* Desktop Links */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path} 
                  className={pathname === item.path ? 'active' : ''}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button */}
        <div className="nav-actions">
          <Link href="/booking" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Book Now
          </Link>
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean Overlay) */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <span className="logo">
              <span className="blue">Wash Eat</span><span className="orange">Fix</span>
            </span>
            <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>×</button>
          </div>
          <ul className="mobile-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path} 
                  className={pathname === item.path ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li style={{ marginTop: '20px' }}>
              <Link 
                href="/booking" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Now
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Extra CSS just for mobile menu component */}
      <style jsx>{`
        .desktop-nav {
          display: block;
        }
        .mobile-toggle-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 4px 8px;
        }
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #0a0a0c;
          z-index: 1000;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 2.5rem;
          cursor: pointer;
        }
        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 24px;
          list-style: none;
          font-size: 1.25rem;
        }
        .mobile-links a {
          color: var(--text-secondary);
          font-weight: 600;
          display: block;
          padding: 8px 0;
        }
        .mobile-links a.active {
          color: var(--text-primary);
          border-left: 3px solid var(--accent-orange);
          padding-left: 12px;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-toggle-btn {
            display: block;
            margin-left: 12px;
          }
        }
      `}</style>
    </header>
  );
}
