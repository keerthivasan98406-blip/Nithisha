import React, { useState } from 'react';
import { Bell, MessageCircle, User, Check, X, Sparkles } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function TopBar() {
  const {
    activeTab,
    websiteSettings,
    adminSettings,
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useAdmin();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabTitles = {
    dashboard: 'Dashboard Overview',
    products: 'Product Management',
    orders: 'Orders Management',
    customers: 'Customer Directory',
    analytics: 'Store Performance & Analytics',
    offers: 'Offers & Promotions',
    settings: 'Website Boutique Settings',
    'admin-settings': 'Admin Profile & Security'
  };

  return (
    <header
      style={{
        height: '70px',
        background: '#FFFFFF',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* Left: Active Section Breadcrumb */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Admin Panel</span>
          <span>/</span>
          <span style={{ color: 'var(--dusty-rose)', fontWeight: 500, textTransform: 'capitalize' }}>
            {activeTab.replace('-', ' ')}
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '1px' }}>
          {tabTitles[activeTab] || 'Management'}
        </h2>
      </div>

      {/* Right: Status & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
        
        {/* WhatsApp Connection Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#F0FAF3',
            border: '1px solid #D2EEDD',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            color: '#1B6A38'
          }}
          title={`Store WhatsApp: ${websiteSettings.whatsapp_number} (Orders connect directly)`}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#25D366',
              display: 'inline-block'
            }}
            className="pulse-dot"
          />
          <MessageCircle size={14} color="#25D366" />
          <span style={{ fontWeight: 600 }}>WhatsApp: Connected</span>
        </div>

        {/* Notifications Icon & Popover */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            style={{
              background: isNotificationsOpen ? 'var(--bg-blush-soft)' : '#FFFFFF',
              border: '1px solid var(--border-light)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              color: 'var(--text-main)',
              transition: 'all 0.2s ease'
            }}
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--dusty-rose)',
                  color: '#FFFFFF',
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(197, 125, 138, 0.4)'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div
              className="animate-slide-up"
              style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '340px',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-modal)',
                border: '1px solid var(--border-light)',
                zIndex: 100,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-blush-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bell size={15} color="var(--dusty-rose)" />
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    Store Notifications
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    style={{ background: 'transparent', fontSize: '0.74rem', color: 'var(--dusty-rose)', fontWeight: 500 }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                    No alerts at this moment.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      style={{
                        padding: '12px 18px',
                        borderBottom: '1px solid var(--border-light)',
                        background: n.read ? '#FFFFFF' : 'var(--bg-blush-subtle)',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: n.read ? 500 : 600, color: 'var(--text-main)' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Owner Profile / Avatar */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--burgundy-deep)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.88rem',
                boxShadow: '0 2px 8px var(--burgundy-glow)'
              }}
            >
              {adminSettings?.avatar_initials || 'LU'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {websiteSettings?.shop_name || 'LURELLE'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--dusty-rose)', fontWeight: 500 }}>
                Owner
              </div>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
}
