import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function FloatingWhatsApp() {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(true);
  const [pastHero, setPastHero] = useState(false);

  // Only show floating button after user scrolls past the hero section
  useEffect(() => {
    const handleScroll = () => {
      // Hero section is roughly 100vh tall — hide button until scrolled past it
      const heroHeight = window.innerHeight * 0.8;
      setPastHero(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render at all when on hero section
  if (!pastHero) return null;

  const openWhatsApp = () => {
    const number = (settings.whatsapp_number || '+919080772273').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${settings.shop_name || 'Nithisha Collection'}! I have a question about your jewellery.`);
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px'
      }}
    >
      {/* Tooltip prompt */}
      {showTooltip && (
        <div
          className="animate-fade-in"
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            border: '1px solid var(--border-light)',
            fontSize: '0.8rem',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '220px'
          }}
        >
          <span>Chat with us on WhatsApp for orders & queries!</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            style={{ background: 'transparent', padding: '2px', color: 'var(--text-muted)' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={openWhatsApp}
        aria-label="Chat on WhatsApp"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          position: 'relative'
        }}
        className="wa-float-btn"
      >
        <MessageCircle size={30} />
      </button>

      <style>{`
        .wa-float-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 8px 26px rgba(37, 211, 102, 0.55);
        }
      `}</style>
    </div>
  );
}
