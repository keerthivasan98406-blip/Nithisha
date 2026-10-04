import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Tag,
  Globe,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, websiteSettings, showToast } = useAdmin();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'settings', label: 'Website Settings', icon: Globe }
  ];

  const handleSignOut = () => {
    showToast('Signed out of LURELLE Owner Portal session.', 'info');
  };

  const handleViewLiveWebsite = () => {
    showToast('Storefront preview: Public store is disabled in Owner Portal mode.', 'info');
  };

  return (
    <aside
      style={{
        width: '260px',
        background: '#FFFFFF',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        flexShrink: 0
      }}
      className="admin-sidebar"
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 22px 20px 22px',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--bg-blush-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--burgundy-deep)'
            }}
          >
            <Sparkles size={18} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.65rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: 'var(--burgundy-deep)',
              lineHeight: 1
            }}
          >
            {websiteSettings?.shop_name || 'LURELLE'}
          </span>
        </div>
        <div
          style={{
            fontSize: '0.70rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--dusty-rose)',
            marginTop: '6px',
            fontWeight: 600,
            paddingLeft: '2px'
          }}
        >
          OWNER PORTAL
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav
        style={{
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
          overflowY: 'auto'
        }}
      >
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
                padding: '11px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--bg-blush-subtle)' : 'transparent',
                color: isActive ? 'var(--burgundy-deep)' : 'var(--text-secondary)',
                borderLeft: isActive ? '3px solid var(--burgundy-deep)' : '3px solid transparent',
                textAlign: 'left',
                transition: 'all 0.18s ease'
              }}
              className="sidebar-nav-btn"
            >
              <Icon
                size={18}
                color={isActive ? 'var(--burgundy-deep)' : 'var(--text-muted)'}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span style={{ letterSpacing: '0.01em' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div
        style={{
          padding: '16px 14px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          background: '#FCFBFB'
        }}
      >
        <button
          onClick={handleViewLiveWebsite}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '9px 14px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            background: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)'
          }}
          className="sidebar-bottom-btn"
        >
          <span style={{ fontWeight: 500 }}>View Live Website</span>
          <ExternalLink size={13} color="var(--text-muted)" />
        </button>

        <button
          onClick={() => setActiveTab('admin-settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '9px 14px',
            fontSize: '0.82rem',
            fontWeight: activeTab === 'admin-settings' ? 600 : 500,
            color: activeTab === 'admin-settings' ? 'var(--burgundy-deep)' : 'var(--text-secondary)',
            background: activeTab === 'admin-settings' ? 'var(--bg-blush-subtle)' : 'transparent',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid transparent',
            textAlign: 'left'
          }}
          className="sidebar-bottom-btn"
        >
          <Settings size={15} color={activeTab === 'admin-settings' ? 'var(--burgundy-deep)' : 'var(--text-muted)'} />
          <span>Settings</span>
        </button>

        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '9px 14px',
            fontSize: '0.82rem',
            color: '#B8323E',
            background: 'transparent',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'left'
          }}
          className="sidebar-bottom-btn"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        .sidebar-nav-btn:hover {
          background: var(--bg-blush-subtle) !important;
          color: var(--burgundy-deep) !important;
        }
        .sidebar-bottom-btn:hover {
          border-color: var(--dusty-rose) !important;
          color: var(--burgundy-deep) !important;
        }
        @media (max-width: 900px) {
          .admin-sidebar {
            width: 72px !important;
          }
          .admin-sidebar span,
          .admin-sidebar div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
}
