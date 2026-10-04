import React from 'react';
import Hero from '../components/Hero';
import { Sparkles, Shield, HeartHandshake } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function HomePage({ navigate }) {
  const { settings } = useSettings();

  return (
    <div>
      {/* SECTION 2: HERO */}
      <Hero navigate={navigate} />

      {/* Brand Values / Quality Statement Bar */}
      <section style={{ padding: '64px 0', borderTop: '1px solid var(--border-light)', background: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '32px',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--bg-blush-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'var(--accent-rosegold-dark)'
                }}
              >
                <Sparkles size={24} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '6px' }}>
                Handpicked Fancy Designs
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '280px' }}>
                Runway-inspired, contemporary jewellery crafted for parties, college, gifting and daily charm.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--bg-blush-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'var(--accent-rosegold-dark)'
                }}
              >
                <Shield size={24} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '6px' }}>
                Skin-Friendly & Durable Plating
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '280px' }}>
                Lightweight, nickel-free and lead-free fashion alloys carefully tested for daily comfort.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--bg-blush-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'var(--accent-rosegold-dark)'
                }}
              >
                <HeartHandshake size={24} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '6px' }}>
                Direct WhatsApp Ordering
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '280px' }}>
                No complex carts or payment gateways. Directly speak with the boutique owner on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
