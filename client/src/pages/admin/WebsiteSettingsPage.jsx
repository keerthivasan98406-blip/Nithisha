import React, { useState } from 'react';
import {
  Globe,
  Save,
  MessageCircle,
  Building,
  Phone,
  Mail,
  Truck,
  CreditCard,
  Share2,
  Search,
  Sparkles,
  Check
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function WebsiteSettingsPage() {
  const { websiteSettings, updateWebsite, showToast } = useAdmin();

  const [activeSection, setActiveSection] = useState('brand');
  const [form, setForm] = useState({ ...websiteSettings });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateWebsite(form);
  };

  const sections = [
    { id: 'brand', label: 'Brand Settings', icon: Sparkles },
    { id: 'store', label: 'Store Information', icon: Building },
    { id: 'contact', label: 'Contact Information', icon: Phone },
    { id: 'whatsapp', label: 'WhatsApp Settings', icon: MessageCircle },
    { id: 'payment', label: 'Payment Settings', icon: CreditCard },
    { id: 'shipping', label: 'Shipping Settings', icon: Truck },
    { id: 'tax', label: 'Tax Settings', icon: Globe },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'seo', label: 'SEO Settings', icon: Search }
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '26px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Website & Storefront Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
            Control customer-facing branding, WhatsApp ordering parameters, shipping rates, and store profiles.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary"
          style={{ padding: '10px 24px' }}
        >
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Two Column Layout: Navigation on Left, Form on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '28px',
          alignItems: 'start'
        }}
        className="settings-layout"
      >
        
        {/* Settings Navigation List */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            padding: '12px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {sections.map(s => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? 'var(--bg-blush-subtle)' : 'transparent',
                  color: isActive ? 'var(--burgundy-deep)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '3px solid var(--burgundy-deep)' : '3px solid transparent',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--burgundy-deep)' : 'var(--text-muted)'} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Form Body */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            padding: '32px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* 1. BRAND SETTINGS */}
            {activeSection === 'brand' && (
              <>
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>Brand Settings</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Store name, tagline, and editorial brand identity</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Shop Brand Name</label>
                    <input
                      type="text"
                      value={form.shop_name}
                      onChange={(e) => handleChange('shop_name', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Wordmark / Logo Text</label>
                    <input
                      type="text"
                      value={form.logo_text}
                      onChange={(e) => handleChange('logo_text', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Brand Tagline</label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Hero Title</label>
                    <input
                      type="text"
                      value={form.hero_title}
                      onChange={(e) => handleChange('hero_title', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Hero Subtitle</label>
                    <input
                      type="text"
                      value={form.hero_subtitle}
                      onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* 2. STORE INFORMATION */}
            {activeSection === 'store' && (
              <>
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>Store Information</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Physical studio address and opening hours</p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Boutique Name</label>
                  <input
                    type="text"
                    value={form.boutique_name}
                    onChange={(e) => handleChange('boutique_name', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Studio / Showroom Address</label>
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Boutique Opening Hours</label>
                  <input
                    type="text"
                    value={form.opening_hours}
                    onChange={(e) => handleChange('opening_hours', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* 3. CONTACT INFORMATION */}
            {activeSection === 'contact' && (
              <>
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>Contact Information</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Public phone lines and support mailboxes</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Phone Number</label>
                    <input
                      type="text"
                      value={form.phone_number}
                      onChange={(e) => handleChange('phone_number', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Support Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* 4. WHATSAPP SETTINGS */}
            {activeSection === 'whatsapp' && (
              <>
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>WhatsApp Concierge Settings</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Direct ordering number that receives customer orders</p>
                </div>

                <div style={{ background: '#F0F9F3', border: '1px solid #D2EEDD', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1B6A38', marginBottom: '6px' }}>
                    Owner WhatsApp Order Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.whatsapp_number}
                    onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                    placeholder="+919876543210"
                    style={{ fontSize: '1rem', fontWeight: 600 }}
                  />
                  <p style={{ fontSize: '0.74rem', color: '#2D7A49', marginTop: '6px' }}>
                    All customer BUY NOW clicks will target this phone number with their order details pre-filled.
                  </p>
                </div>
              </>
            )}

            {/* 5. PAYMENT SETTINGS */}
            {activeSection === 'payment' && (
              <>
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>Payment Settings</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Direct UPI and bank instructions shared with customers over WhatsApp</p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Boutique UPI ID (GPay / PhonePe / Paytm)</label>
                  <input
                    type="text"
                    value={form.upi_id}
                    onChange={(e) => handleChange('upi_id', e.target.value)}
                    placeholder="lurelle.jewels@okhdfcbank"
                  />
                </div>
              </>
            )}

            {/* 6. SHIPPING SETTINGS */}
            {activeSection === 'shipping' && (
              <>
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>Shipping Settings</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Standard rates and free shipping threshold</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Standard Delivery Fee (₹)</label>
                    <input
                      type="number"
                      value={form.standard_shipping}
                      onChange={(e) => handleChange('standard_shipping', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Free Shipping Order Minimum (₹)</label>
                    <input
                      type="number"
                      value={form.free_shipping_min}
                      onChange={(e) => handleChange('free_shipping_min', Number(e.target.value))}
                    />
                  </div>
                </div>
              </>
            )}

            {/* 7. TAX SETTINGS */}
            {activeSection === 'tax' && (
              <>
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>Tax / GST Settings</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Tax percentages calculated on orders</p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>GST Tax Rate (%)</label>
                  <input
                    type="number"
                    value={form.tax_rate_percent}
                    onChange={(e) => handleChange('tax_rate_percent', Number(e.target.value))}
                  />
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Standard fashion jewellery GST in India is 3%.
                  </p>
                </div>
              </>
            )}

            {/* 8. SOCIAL MEDIA */}
            {activeSection === 'social' && (
              <>
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>Social Media Links</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Official Instagram profile and handles</p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Instagram Profile URL</label>
                  <input
                    type="url"
                    value={form.instagram_url}
                    onChange={(e) => handleChange('instagram_url', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* 9. SEO SETTINGS */}
            {activeSection === 'seo' && (
              <>
                <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>SEO Settings</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Search engine index metadata</p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>About Store Philosophy</label>
                  <textarea
                    rows={3}
                    value={form.about_philosophy}
                    onChange={(e) => handleChange('about_philosophy', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Quality Statement</label>
                  <textarea
                    rows={3}
                    value={form.about_quality}
                    onChange={(e) => handleChange('about_quality', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Save Button */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ padding: '10px 28px' }}>
                <Check size={16} />
                <span>Save All Settings</span>
              </button>
            </div>

          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .settings-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
