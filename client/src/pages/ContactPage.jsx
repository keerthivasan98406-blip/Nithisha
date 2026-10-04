import { MessageCircle, Phone, Mail, MapPin, Clock, Sparkles, Send } from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';
import { useSettings } from '../context/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();

  const openWhatsApp = () => {
    const number = (settings.whatsapp_number || '+919876543210').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${settings.shop_name || 'Nithisha Collection'}! I am contacting you through your website.`);
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <div style={{ padding: '50px 0 90px 0' }}>
      <div className="container">
        
        {/* Heading */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 54px auto' }}>
          <span
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--accent-rosegold-dark)',
              display: 'block',
              marginBottom: '8px'
            }}
          >
            Get In Touch
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 4vw, 3.2rem)', fontWeight: 500 }}>
            Connect with {settings.shop_name || 'Nithisha Collection'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginTop: '10px' }}>
            We are here to assist with custom styling inquiries, gifting orders, and product availability.
          </p>
        </div>

        {/* Contact Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'stretch'
          }}
          className="contact-grid"
        >
          {/* Left: Contact Info Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              padding: '36px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <Sparkles size={20} color="var(--accent-rosegold)" />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600 }}>
                  Boutique Concierge
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', fontSize: '0.94rem' }}>
                
                {/* Address */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-blush-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} color="var(--accent-rosegold-dark)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Location</div>
                    <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>
                      {settings.shop_address || 'Anna Nagar, Chennai, Tamil Nadu'}
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EAF9F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageCircle size={18} color="#25D366" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>WhatsApp (Direct Orders)</div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 600, marginTop: '2px' }}>
                      {settings.whatsapp_number || '+91 98765 43210'}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-blush-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={18} color="var(--accent-rosegold-dark)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Call Us</div>
                    <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>
                      {settings.phone_number || '+91 98765 43210'}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-blush-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={18} color="var(--accent-rosegold-dark)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Email</div>
                    <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>
                      {settings.email || 'hello@nithishacollection.in'}
                    </div>
                  </div>
                </div>

                {/* Opening Hours */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-blush-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={18} color="var(--accent-rosegold-dark)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Boutique Hours</div>
                    <div style={{ color: 'var(--text-main)', marginTop: '2px' }}>
                      {settings.opening_hours || 'Mon - Sat: 10:30 AM – 8:30 PM'}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Primary Action Button */}
            <div style={{ marginTop: '36px' }}>
              <button
                onClick={openWhatsApp}
                className="btn-whatsapp"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
              >
                <MessageCircle size={20} />
                <span>CHAT ON WHATSAPP</span>
              </button>
            </div>
          </div>

          {/* Right: Map Visual & Boutique Presentation */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Map Placeholder or Embed */}
            <div
              style={{
                position: 'relative',
                height: '320px',
                background: 'linear-gradient(135deg, #F8EAEA 0%, #FAF6F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <div
                className="glass-panel"
                style={{
                  padding: '24px 32px',
                  borderRadius: 'var(--radius-md)',
                  maxWidth: '360px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                }}
              >
                <MapPin size={32} color="var(--accent-rosegold-dark)" style={{ margin: '0 auto 10px auto' }} />
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '6px' }}>
                  Visit Our Boutique
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  {settings.shop_address || 'Anna Nagar, Chennai, Tamil Nadu'}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.shop_address || 'Chennai, India')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Social / Instagram Connection */}
            <div style={{ padding: '32px', background: 'var(--bg-blush-subtle)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <InstagramIcon size={22} color="var(--accent-rosegold-dark)" />
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>
                  Follow Our New Drops
                </h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                We share reels, customer styling photos, and flash fashion jewellery previews on our Instagram feed.
              </p>
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--accent-rosegold-dark)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>@nithisha_collection</span>
                  <Sparkles size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
