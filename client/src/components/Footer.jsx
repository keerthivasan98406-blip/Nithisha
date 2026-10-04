import { Sparkles, MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { useSettings } from '../context/SettingsContext';

export default function Footer({ navigate }) {
  const { settings } = useSettings();

  const openWhatsApp = () => {
    const number = (settings.whatsapp_number || '+919876543210').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${settings.shop_name || 'Nithisha Collection'}! I would like to inquire about your jewellery.`);
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  const categories = [
    { name: 'Earrings', slug: 'earrings' },
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Rings', slug: 'rings' },
    { name: 'Bracelets', slug: 'bracelets' },
    { name: 'Bangles', slug: 'bangles' },
    { name: 'Anklets', slug: 'anklets' },
    { name: 'Jewellery Sets', slug: 'jewellery-sets' },
    { name: 'Hair Accessories', slug: 'hair-accessories' }
  ];

  return (
    <footer
      style={{
        background: '#FAF2F2',
        borderTop: '1px solid var(--border-light)',
        padding: '64px 0 32px 0',
        marginTop: '80px'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sparkles size={18} color="var(--accent-rosegold)" />
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', letterSpacing: '0.12em', fontWeight: 600 }}>
                {settings.shop_name || 'Nithisha Collection'}
              </span>
            </div>
            <p style={{ color: 'var(--accent-rosegold-dark)', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontSize: '1.05rem', marginBottom: '16px' }}>
              "{settings.tagline || 'Jewellery That Tells Your Story'}"
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Affordable fashion and fancy jewellery for girls and women. Handpicked everyday elegance, delivered with personal care.
            </p>
            <button onClick={openWhatsApp} className="btn-whatsapp" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <MessageCircle size={16} />
              <span>Chat with Us</span>
            </button>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '16px', letterSpacing: '0.04em' }}>
              Shop By Category
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              {categories.map((c) => (
                <a
                  key={c.slug}
                  href={`/shop?category=${c.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/shop?category=${c.slug}`);
                  }}
                  style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>

          {/* Boutique Information */}
          <div>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '16px', letterSpacing: '0.04em' }}>
              Boutique Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--accent-rosegold)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>{settings.shop_address || 'Anna Nagar, Chennai, Tamil Nadu'}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} color="var(--accent-rosegold)" style={{ flexShrink: 0 }} />
                <span>{settings.phone_number || '+91 98765 43210'}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} color="var(--accent-rosegold)" style={{ flexShrink: 0 }} />
                <span>{settings.email || 'hello@nithishacollection.in'}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={16} color="var(--accent-rosegold)" style={{ flexShrink: 0 }} />
                <span>{settings.opening_hours || 'Mon - Sat: 10:30 AM – 8:30 PM'}</span>
              </div>
              {settings.instagram_url && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                  <InstagramIcon size={16} color="var(--accent-rosegold)" style={{ flexShrink: 0 }} />
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-rosegold-dark)', fontWeight: 500 }}>
                    Follow on Instagram
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © {new Date().getFullYear()} {settings.shop_name || 'Nithisha Collection'}. All rights reserved. Direct WhatsApp Ordering.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a
              href="/admin/login"
              onClick={(e) => {
                e.preventDefault();
                navigate('/admin/login');
              }}
              style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
