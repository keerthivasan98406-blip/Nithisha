import React, { useState, useEffect } from 'react';
import { Save, Check, MessageCircle, Sparkles, Building, Phone, Mail, Clock, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminSettings() {
  const { token } = useAuth();
  const { settings, refreshSettings } = useSettings();

  const [formValues, setFormValues] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadingHero, setUploadingHero] = useState({ 1: false, 2: false, 3: false });

  useEffect(() => {
    setFormValues({ ...settings });
  }, [settings]);

  const handleChange = (key, value) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleHeroUpload = async (e, slideNum) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    setUploadingHero(prev => ({ ...prev, [slideNum]: true }));

    const keyMap = { 1: 'hero_image', 2: 'hero_image_2', 3: 'hero_image_3' };

    try {
      const res = await fetch('/api/upload/single', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      if (res.ok) {
        const uploadRes = await res.json();
        handleChange(keyMap[slideNum], uploadRes.url);
      } else {
        alert('Upload failed');
      }
    } catch {
      alert('Upload error');
    } finally {
      setUploadingHero(prev => ({ ...prev, [slideNum]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formValues)
      });

      if (res.ok) {
        await refreshSettings();
        setSuccessMsg('Website settings saved successfully! Changes are live immediately.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert('Failed to update settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 600 }}>
            Website & Boutique Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px' }}>
            Unified configuration for branding, owner WhatsApp ordering number, hero banner, and boutique details.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary"
          style={{ padding: '10px 24px', fontSize: '0.88rem' }}
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {successMsg && (
        <div
          className="animate-fade-in"
          style={{
            background: '#EFF7F2',
            border: '1px solid #CCE8D8',
            color: '#4F8A68',
            padding: '12px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Check size={18} color="#4F8A68" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* GROUP 1: WHATSAPP ORDERING & BRAND IDENTITY */}
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
            <MessageCircle size={20} color="#25D366" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>
              WhatsApp Order Configuration & Brand Identity
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            
            {/* WhatsApp Number (CRUCIAL) */}
            <div style={{ gridColumn: 'span 2', background: '#EFF7F2', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid #CCE8D8' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#4F8A68', marginBottom: '6px' }}>
                Owner WhatsApp Number (Receives All Customer Orders) *
              </label>
              <input
                type="text"
                required
                value={formValues.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="+919876543210"
                style={{ fontSize: '1rem', fontWeight: 600 }}
              />
              <p style={{ fontSize: '0.76rem', color: '#4F8A68', marginTop: '4px' }}>
                All "BUY NOW" orders and "Continue to WhatsApp" buttons automatically generate click-to-chat links targeted to this exact phone number with country code.
              </p>
            </div>

            {/* Shop Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Shop Name *
              </label>
              <input
                type="text"
                required
                value={formValues.shop_name || ''}
                onChange={(e) => handleChange('shop_name', e.target.value)}
                placeholder="LURELLE"
              />
            </div>

            {/* Tagline */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Tagline
              </label>
              <input
                type="text"
                value={formValues.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Jewellery That Tells Your Story"
              />
            </div>

          </div>
        </div>

        {/* GROUP 2: HERO BANNER & HOMEPAGE EDITORIAL */}
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
            <Sparkles size={20} color="var(--accent-rosegold)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>
              Hero Section & Visual Editorial
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            
            {/* Hero Title */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Hero Main Headline
              </label>
              <input
                type="text"
                value={formValues.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                placeholder="Jewellery That Tells Your Story"
              />
            </div>

            {/* Hero Subtitle */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Hero Supporting Subtitle
              </label>
              <input
                type="text"
                value={formValues.hero_subtitle || ''}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                placeholder="Elegant, affordable and uniquely you."
              />
            </div>

            {/* Hero Images - 3 slides */}
            {[
              { num: 1, key: 'hero_image', label: 'Slide 1 Image (Main Banner)' },
              { num: 2, key: 'hero_image_2', label: 'Slide 2 Image' },
              { num: 3, key: 'hero_image_3', label: 'Slide 3 Image' }
            ].map(({ num, key, label }) => (
              <div key={key} style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 500 }}>
                    {label}
                  </label>
                  <label
                    style={{
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      color: 'var(--accent-rosegold-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Upload size={14} />
                    <span>{uploadingHero[num] ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHeroUpload(e, num)}
                      disabled={uploadingHero[num]}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={formValues[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                />
                {formValues[key] && (
                  <div style={{ marginTop: '8px', borderRadius: '6px', overflow: 'hidden', height: '80px' }}>
                    <img
                      src={formValues[key]}
                      alt={`Slide ${num} preview`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            ))}

          </div>
        </div>

        {/* GROUP 3: CONTACT & BOUTIQUE LOCATION */}
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
            <Building size={20} color="var(--accent-rosegold)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>
              Contact & Boutique Location
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            
            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Customer Service Phone
              </label>
              <input
                type="text"
                value={formValues.phone_number || ''}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formValues.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="hello@lurelle.in"
              />
            </div>

            {/* Instagram */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Instagram URL
              </label>
              <input
                type="text"
                value={formValues.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/lurelle.jewels"
              />
            </div>

            {/* Opening Hours */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Boutique Opening Hours
              </label>
              <input
                type="text"
                value={formValues.opening_hours || ''}
                onChange={(e) => handleChange('opening_hours', e.target.value)}
                placeholder="Mon - Sat: 10:30 AM – 8:30 PM | Sun: 11:00 AM – 7:00 PM"
              />
            </div>

            {/* Shop Address */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Boutique Physical Address
              </label>
              <textarea
                rows={2}
                value={formValues.shop_address || ''}
                onChange={(e) => handleChange('shop_address', e.target.value)}
                placeholder="Suite 402, Rosewood Avenue, Anna Nagar, Chennai, Tamil Nadu 600040"
              />
            </div>

          </div>
        </div>

        {/* GROUP 4: ABOUT STORY & QUALITY */}
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
            About Page Narrative & Philosophy
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                About Title
              </label>
              <input
                type="text"
                value={formValues.about_title || ''}
                onChange={(e) => handleChange('about_title', e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Brand Story
              </label>
              <textarea
                rows={3}
                value={formValues.about_story || ''}
                onChange={(e) => handleChange('about_story', e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Jewellery Philosophy
              </label>
              <textarea
                rows={2}
                value={formValues.about_philosophy || ''}
                onChange={(e) => handleChange('about_philosophy', e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                Quality Statement
              </label>
              <textarea
                rows={2}
                value={formValues.about_quality || ''}
                onChange={(e) => handleChange('about_quality', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ padding: '12px 32px', fontSize: '0.92rem' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
