import React, { useState } from 'react';
import { Sparkles, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminLogin({ navigate }) {
  const { login } = useAuth();
  const { settings } = useSettings();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('LurelleAdmin2025!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FCF9F7 0%, #F3E3E1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        className="animate-slide-up"
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid var(--border-light)',
          width: '100%',
          maxWidth: '440px',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--bg-blush-soft)',
            padding: '36px 32px 28px 32px',
            textAlign: 'center',
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              boxShadow: '0 4px 12px rgba(90, 48, 53, 0.08)'
            }}
          >
            <Sparkles size={22} color="var(--accent-rosegold-dark)" />
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {settings.shop_name || 'Nithisha Collection'}
          </h2>
          <p style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-rosegold-dark)', marginTop: '2px', fontWeight: 600 }}>
            Owner Boutique Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          {error && (
            <div
              style={{
                background: '#FDF2F2',
                border: '1px solid #F7D5D5',
                color: '#C96B6B',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
                placeholder="admin"
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '0.9rem' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Owner Portal'}</span>
            <ArrowRight size={16} />
          </button>

          <div
            style={{
              marginTop: '24px',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-blush-subtle)',
              border: '1px solid var(--border-light)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              textAlign: 'center'
            }}
          >
            <strong>Default Credentials:</strong><br />
            Username: <code style={{ color: 'var(--accent-rosegold-dark)' }}>admin</code> &nbsp;|&nbsp; 
            Password: <code style={{ color: 'var(--accent-rosegold-dark)' }}>LurelleAdmin2025!</code>
          </div>

          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{ background: 'transparent', fontSize: '0.82rem', color: 'var(--text-muted)' }}
            >
              ← Back to live website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
