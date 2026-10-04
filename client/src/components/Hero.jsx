import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Hero({ navigate }) {
  const { settings } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: settings.hero_image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1920&q=85',
      ctaText: 'Shop Jewellery',
      ctaLink: '/shop',
      btnPosition: 'right'
    },
    {
      id: 2,
      image: settings.hero_image_2 || 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1920&q=85',
      ctaText: 'Explore Collection',
      ctaLink: '/shop',
      btnPosition: 'right'
    },
    {
      id: 3,
      image: settings.hero_image_3 || 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1920&q=85',
      ctaText: 'Shop Now',
      ctaLink: '/shop',
      btnPosition: 'left'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [slides.length]);

  const openWhatsApp = () => {
    const number = (settings.whatsapp_number || '+919080772273').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${settings.shop_name || 'Nithisha Collection'}! I would like to explore your jewellery collection.`);
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <>
      <section style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        background: '#1F1B1D',
        display: 'block'
      }} className="hero-section">

        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div key={slide.id} style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 0.9s ease, visibility 0.9s',
              zIndex: isActive ? 2 : 1
            }}>
              {/* Image */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                maxWidth: '100%'
              }} />

              {/* Dark overlay at bottom */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '45%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)'
              }} />

              {/* Buttons */}
              <div className={`hero-btn-wrap hero-btn-${slide.btnPosition}`} style={{
                position: 'absolute',
                zIndex: 3,
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.8s ease 0.2s'
              }}>
                <button
                  onClick={() => navigate(slide.ctaLink)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(212,155,142,0.92)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap'
                  }}
                  className="hero-shop-btn"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={openWhatsApp}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: '#25D366',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}
                  className="hero-wa-btn"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Dots */}
        <div style={{
          position: 'absolute', bottom: '10px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 10,
          display: 'flex', gap: '7px', alignItems: 'center'
        }}>
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '26px' : '7px',
                height: '6px', borderRadius: '999px', padding: 0,
                background: idx === currentSlide ? 'var(--accent-rosegold)' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s ease', border: 'none', cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </section>

      <style>{`
        /* Desktop */
        .hero-section {
          height: calc(100vh - 50px);
          min-height: 480px;
          max-height: 900px;
        }
        .hero-btn-wrap {
          bottom: 44px;
        }
        .hero-btn-right {
          right: 40px;
          justify-content: flex-end;
        }
        .hero-btn-left {
          left: 40px;
          justify-content: flex-start;
        }
        .hero-shop-btn, .hero-wa-btn {
          padding: 11px 22px;
          font-size: 0.88rem;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .hero-section {
            height: 55vw !important;
            min-height: 180px !important;
            max-height: 360px !important;
          }
          .hero-btn-wrap {
            bottom: 8px !important;
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) !important;
            justify-content: center !important;
          }
          .hero-shop-btn, .hero-wa-btn {
            padding: 6px 12px !important;
            font-size: 0.72rem !important;
            border-radius: 4px !important;
          }
          .hero-shop-btn svg, .hero-wa-btn svg {
            width: 12px !important;
            height: 12px !important;
          }
        }
      `}</style>
    </>
  );
}
