import React from 'react';
import { LayoutDashboard, Package, Grid, Settings, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminLayout({ activeTab, setActiveTab, navigate, children }) {
  const { logout, user } = useAuth();
  const { settings } = useSettings();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'settings', label: 'Website Settings', icon: Settings }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50
        }}
        className="admin-sidebar"
      >
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-rosegold)" />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>
              {settings.shop_name || 'LURELLE'}
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-rosegold-dark)', marginTop: '2px', fontWeight: 600 }}>
            Owner Boutique Portal
          </div>
        </div>

        {/* Navigation Items (STRICTLY Dashboard, Products, Categories, Settings) */}
        <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? 'var(--bg-blush-soft)' : 'transparent',
                  color: isActive ? 'var(--accent-rosegold-dark)' : 'var(--text-secondary)',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-rosegold)' : 'currentColor'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User & Store Actions */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '8px 12px',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              background: 'transparent',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)'
            }}
          >
            <span>View Live Website</span>
            <ExternalLink size={14} />
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '8px 12px',
              fontSize: '0.82rem',
              color: '#C96B6B',
              background: '#FDF2F2',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <LogOut size={15} />
            <span>Sign Out ({user?.username || 'Owner'})</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Top Header */}
        <header
          style={{
            height: '64px',
            background: '#FFFFFF',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
              {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab === 'products' ? 'Product Management' : activeTab === 'categories' ? 'Category Management' : 'Website Settings'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <span>WhatsApp Connected: <strong style={{ color: '#25D366' }}>{settings.whatsapp_number}</strong></span>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ padding: '32px', flex: 1 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 70px !important;
          }
          .admin-sidebar span {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
