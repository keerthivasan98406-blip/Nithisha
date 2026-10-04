import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function AboutPage({ navigate }) {
  const { settings } = useSettings();

  const openWhatsApp = () => {
    const number = (settings.whatsapp_number || '+919876543210').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${settings.shop_name || 'LURELLE'}! I read about your story and would love to chat.`);
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <div style={{ padding: '50px 0 90px 0' }}>
      <div className="container-narrow">
        
        {/* Editorial Heading */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--accent-rosegold-dark)'
            }}
          >
            The Brand Story
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', marginTop: '6px', fontWeight: 500 }}>
            {settings.about_title || 'Crafting Everyday Luxury for Every Woman'}
          </h1>
          <p style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--accent-rosegold-dark)', fontSize: '1.2rem', marginTop: '8px' }}>
            "{settings.tagline || 'Jewellery That Tells Your Story'}"
          </p>
        </div>

        {/* Feature Visual */}
        <div
          style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            border: '8px solid #FFFFFF',
            marginBottom: '48px',
            maxHeight: '460px'
          }}
        >
          <img
            src={settings.about_image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80'}
            alt="LURELLE Jewellery Boutique"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Narrative */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 400 }}>
            {settings.about_story}
          </p>

          <div
            style={{
              background: 'var(--bg-blush-soft)',
              padding: '28px 32px',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--accent-rosegold)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '10px' }}>
              Our Philosophy
            </h3>
            <p style={{ fontSize: '0.96rem', margin: 0, color: 'var(--text-secondary)' }}>
              {settings.about_philosophy}
            </p>
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '10px' }}>
              Quality & Hypoallergenic Craft
            </h3>
            <p style={{ fontSize: '0.96rem' }}>
              {settings.about_quality}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ marginTop: '54px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/shop')} className="btn-primary" style={{ padding: '14px 32px' }}>
            <span>Shop Our Collection</span>
            <ArrowRight size={16} />
          </button>

          <button onClick={openWhatsApp} className="btn-whatsapp" style={{ padding: '14px 28px' }}>
            <MessageCircle size={18} />
            <span>Chat on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}
