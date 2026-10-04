import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, X, MessageCircle, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';

export default function Header({ currentRoute, navigate }) {
  const { settings } = useSettings();
  const { cartCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 40);
      if (currentY > 80 && currentY > lastScrollY.current) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openWhatsApp = () => {
    const number = (settings.whatsapp_number || '+919080772273').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${settings.shop_name || 'Nithisha Collection'}! I am visiting your website and have an inquiry.`);
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'SHOP', path: '/shop' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACT', path: '/contact' }
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isScrolled ? 'rgba(255,255,255,0.96)' : 'rgba(250,246,246,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: isScrolled ? '1px solid var(--border-light)' : '1px solid transparent',
        padding: isScrolled ? '4px 0' : '6px 0',
        transition: 'all 0.3s ease, transform 0.3s ease',
        boxShadow: isScrolled ? '0 4px 20px rgba(165,100,86,0.06)' : 'none',
        transform: isHidden ? 'translateY(-100%)' : 'translateY(0)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Mobile hamburger — left */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ display: 'none', background: 'transparent', color: 'var(--text-main)', padding: '6px' }}
            className="mobile-toggle"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo — left on desktop, center on mobile */}
          <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--accent-rosegold)" />
            <span className="brand-name" style={{
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: 'var(--text-main)',
              transition: 'font-size var(--transition-smooth)',
              fontSize: isScrolled ? '1.3rem' : '1.5rem',
              whiteSpace: 'nowrap'
            }}>
              {settings.shop_name || 'Nithisha Collection'}
            </span>
          </div>

          {/* Right: Nav + Cart (desktop) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              {navLinks.map((link) => {
                const isActive = currentRoute === link.path || (link.path !== '/' && currentRoute.startsWith(link.path));
                return (
                  <a key={link.path} href={link.path}
                    onClick={(e) => { e.preventDefault(); navigate(link.path); }}
                    style={{
                      fontSize: '0.82rem', letterSpacing: '0.1em',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--accent-rosegold-dark)' : 'var(--text-secondary)',
                      position: 'relative', padding: '4px 0', textDecoration: 'none'
                    }}
                  >
                    {link.label}
                    {isActive && <span style={{
                      position: 'absolute', bottom: 0, left: '50%',
                      transform: 'translateX(-50%)', width: '16px', height: '2px',
                      background: 'var(--accent-rosegold)', borderRadius: '2px'
                    }} />}
                  </a>
                );
              })}
            </nav>

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)}
              style={{ background: 'transparent', color: 'var(--text-main)', padding: '6px', position: 'relative', display: 'flex', alignItems: 'center' }}
              title="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '1px', right: '1px',
                  background: 'var(--accent-rosegold-dark)', color: '#FFF',
                  fontSize: '0.6rem', fontWeight: 700, width: '15px', height: '15px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{cartCount}</span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(35,30,32,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-start' }}
          onClick={() => setIsMobileMenuOpen(false)}>
          <div style={{ width: '80%', maxWidth: '300px', height: '100%', background: 'var(--bg-surface)', padding: '24px 20px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 24px rgba(0,0,0,0.15)' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 600 }}>
                {settings.shop_name || 'Nithisha Collection'}
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'transparent', color: 'var(--text-main)', padding: '4px' }}>
                <X size={22} />
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              {navLinks.map((link) => (
                <a key={link.path} href={link.path}
                  onClick={(e) => { e.preventDefault(); navigate(link.path); setIsMobileMenuOpen(false); }}
                  style={{
                    fontSize: '1rem', fontFamily: 'var(--font-serif)', letterSpacing: '0.06em',
                    padding: '8px 0', borderBottom: '1px solid var(--border-light)', textDecoration: 'none',
                    color: currentRoute === link.path ? 'var(--accent-rosegold-dark)' : 'var(--text-main)'
                  }}
                >{link.label}</a>
              ))}
            </nav>
            <button onClick={() => { openWhatsApp(); setIsMobileMenuOpen(false); }} className="btn-whatsapp" style={{ width: '100%', marginTop: 'auto' }}>
              <MessageCircle size={16} />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
          .brand-name { font-size: 1.1rem !important; }
        }
      `}</style>
    </>
  );
}
