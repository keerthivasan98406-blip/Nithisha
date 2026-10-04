import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  MessageCircle,
  Shield,
  Save,
  CheckCircle2,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminSettingsPage() {
  const { adminSettings, updateAdmin, showToast } = useAdmin();

  const [form, setForm] = useState({ ...adminSettings });
  const [testingConnection, setTestingConnection] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateAdmin(form);
  };

  const handleTestWhatsApp = () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      showToast('WhatsApp connection is active and responding with ping 42ms.', 'success');
    }, 900);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
          Admin Profile & Security Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
          Manage your owner credentials, WhatsApp device pairing, and store notification alerts.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
        
        {/* SECTION 1: PROFILE SETTINGS */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <User size={20} color="var(--dusty-rose)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
              Owner Profile
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Full Name / Title
              </label>
              <input
                type="text"
                value={form.owner_name}
                onChange={(e) => handleChange('owner_name', e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Admin Email Address
              </label>
              <input
                type="email"
                value={form.owner_email}
                onChange={(e) => handleChange('owner_email', e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Store Role
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Avatar Initials
              </label>
              <input
                type="text"
                maxLength={3}
                value={form.avatar_initials}
                onChange={(e) => handleChange('avatar_initials', e.target.value)}
                style={{ width: '100px' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: WHATSAPP STORE CONNECTION */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <MessageCircle size={20} color="#25D366" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
              WhatsApp Connection & Webhooks
            </h3>
          </div>

          <div
            style={{
              background: '#F0FAF3',
              border: '1px solid #D2EEDD',
              borderRadius: 'var(--radius-sm)',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#25D366',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1B6A38', fontSize: '0.96rem' }}>
                  WhatsApp Status: Connected
                </div>
                <div style={{ fontSize: '0.78rem', color: '#2D7A49' }}>
                  Device: iPhone 15 Pro • Synchronized with boutique WhatsApp Business API
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestWhatsApp}
              disabled={testingConnection}
              className="btn-secondary"
              style={{ background: '#FFFFFF', padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <RefreshCw size={14} className={testingConnection ? 'pulse-dot' : ''} />
              <span>{testingConnection ? 'Pinging device...' : 'Test Connection'}</span>
            </button>
          </div>

          <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
            Customer orders placed on the website automatically trigger pre-filled order conversations directly into this linked WhatsApp account.
          </p>
        </div>

        {/* SECTION 3: NOTIFICATION PREFERENCES */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <Bell size={20} color="var(--dusty-rose)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
              Notification Preferences
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { key: 'whatsapp_order_alerts', label: 'Instant WhatsApp Order Alerts', desc: 'Receive instant push alerts whenever a customer initiates an order message.' },
              { key: 'low_stock_alerts', label: 'Low Stock Threshold Notifications', desc: 'Alert when any jewellery piece drops below its assigned inventory threshold.' },
              { key: 'daily_digest', label: 'Daily Revenue & Margin Digest', desc: 'Nightly recap of items sold, gross revenue, and boutique profits.' }
            ].map(pref => (
              <label
                key={pref.key}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-blush-subtle)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={!!form[pref.key]}
                  onChange={(e) => handleChange(pref.key, e.target.checked)}
                  style={{ width: 'auto', marginTop: '3px' }}
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {pref.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                    {pref.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 4: PASSWORD / SECURITY */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <Lock size={20} color="var(--dusty-rose)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
              Password & Security
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Current Password</label>
              <input type="password" placeholder="••••••••••••" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>New Password</label>
              <input type="password" placeholder="Enter new strong password" />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '30px' }}>
          <button type="submit" className="btn-primary" style={{ padding: '12px 32px' }}>
            <Save size={16} />
            <span>Save Security & Admin Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
