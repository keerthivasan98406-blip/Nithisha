import React from 'react';
import { X, Phone, Mail, MapPin, MessageCircle, ShoppingBag, Award, Calendar, DollarSign } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function CustomerDrawer({ isOpen, onClose, customer }) {
  const { orders } = useAdmin();

  if (!isOpen || !customer) return null;

  // Retrieve customer orders
  const customerOrders = orders.filter(o => o.customer_phone === customer.phone || o.customer_name === customer.name);
  const avgOrderValue = customer.total_orders > 0 ? Math.round(customer.total_spent / customer.total_orders) : 0;

  const handleWhatsAppContact = () => {
    const clean = customer.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${customer.name}! LURELLE Jewellery Concierge here to assist with your styling inquiries.`);
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-blush-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--burgundy-deep)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}
            >
              {customer.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {customer.name}
                </h3>
                <span
                  style={{
                    background: customer.status === 'VIP' ? '#FAF0E6' : '#EBF8F0',
                    color: customer.status === 'VIP' ? '#A2682A' : '#237A4B',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {customer.status}
                </span>
              </div>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Customer ID: {customer.id} • Registered via WhatsApp
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', padding: '6px', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Key Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '14px',
              textAlign: 'center'
            }}
          >
            <div style={{ background: 'var(--bg-blush-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Spent</span>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--burgundy-deep)', marginTop: '4px' }}>
                ₹{customer.total_spent.toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ background: 'var(--bg-blush-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Orders Completed</span>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                {customer.total_orders}
              </div>
            </div>

            <div style={{ background: 'var(--bg-blush-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Avg. Order Value</span>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: '#237A4B', marginTop: '4px' }}>
                ₹{avgOrderValue.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Contact Details Card */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--dusty-rose)', fontWeight: 600 }}>
                Contact & Shipping Profile
              </span>
              <button
                onClick={handleWhatsAppContact}
                style={{
                  background: '#25D366',
                  color: '#FFFFFF',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <MessageCircle size={13} />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={14} color="var(--dusty-rose)" />
                <span>{customer.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={14} color="var(--dusty-rose)" />
                <span>{customer.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={15} color="var(--dusty-rose)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{customer.address}, {customer.city}, {customer.state}</span>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div>
            <div style={{ fontSize: '0.80rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '12px' }}>
              Customer Order History ({customerOrders.length})
            </div>

            {customerOrders.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                No active orders recorded for this customer ID.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {customerOrders.map(order => (
                  <div
                    key={order.id}
                    style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--dusty-rose)' }}>{order.id}</span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{order.date}</span>
                      </div>
                      <div style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {order.items.map(it => it.name).join(', ')}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--burgundy-deep)' }}>
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                      <span
                        style={{
                          fontSize: '0.70rem',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '3px',
                          background: order.status === 'Delivered' ? '#EBF8F0' : '#FFF6EA',
                          color: order.status === 'Delivered' ? '#237A4B' : '#B46410'
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--border-light)', background: '#FCFBFB', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
