import React from 'react';
import { X, MessageCircle, Phone, Mail, MapPin, CheckCircle2, Clock, Truck, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  const { updateOrderStatus, showToast } = useAdmin();

  if (!isOpen || !order) return null;

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
  };

  const handleContactCustomerWhatsApp = () => {
    const cleanPhone = (order.customer_phone || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${order.customer_name}! This is LURELLE Jewellery regarding your order ${order.id}.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const timelineSteps = [
    { label: 'Order Placed', step: 'Placed' },
    { label: 'Confirmed', step: 'Confirmed' },
    { label: 'Processing', step: 'Processing' },
    { label: 'Shipped', step: 'Shipped' },
    { label: 'Delivered', step: 'Delivered' }
  ];

  const getStepStatus = (stepName) => {
    const statusOrder = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = statusOrder.indexOf(order.status === 'Cancelled' ? 'Pending' : order.status);
    const stepIdx = statusOrder.indexOf(stepName);
    if (order.status === 'Cancelled') return 'cancelled';
    if (stepIdx <= currentIdx) return 'completed';
    return 'upcoming';
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
          maxWidth: '780px',
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
            padding: '20px 28px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-blush-subtle)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Order {order.id}
              </h2>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: order.status === 'Delivered' ? '#EBF8F0' : order.status === 'Shipped' ? '#EDF5FD' : order.status === 'Cancelled' ? '#FDF0F0' : '#FFF6EA',
                  color: order.status === 'Delivered' ? '#237A4B' : order.status === 'Shipped' ? '#1F6EB8' : order.status === 'Cancelled' ? '#B8323E' : '#B46410'
                }}
              >
                {order.status}
              </span>
            </div>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Placed on {order.date} via WhatsApp Concierge
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleContactCustomerWhatsApp}
              style={{
                background: '#25D366',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 3px 10px rgba(37, 211, 102, 0.3)'
              }}
            >
              <MessageCircle size={15} />
              <span>Contact Customer</span>
            </button>

            <button
              onClick={onClose}
              style={{ background: 'transparent', padding: '6px', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Order Timeline Progress */}
          <div
            style={{
              background: '#FAFAF8',
              borderRadius: 'var(--radius-md)',
              padding: '20px 24px',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.80rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                Fulfillment Timeline
              </span>
              
              {/* Quick Status Updater */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Update Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={{ width: 'auto', padding: '4px 10px', fontSize: '0.80rem', height: '32px' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {timelineSteps.map((step, idx) => {
                const state = getStepStatus(step.label);
                const isCompleted = state === 'completed';

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isCompleted ? 'var(--burgundy-deep)' : '#E8DFE1',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: isCompleted ? 600 : 500,
                        color: isCompleted ? 'var(--burgundy-deep)' : 'var(--text-muted)',
                        marginTop: '6px',
                        textAlign: 'center'
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Customer Details */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--dusty-rose)', fontWeight: 600, marginBottom: '10px' }}>
                Customer Information
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                {order.customer_name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} color="var(--dusty-rose)" />
                  <span>{order.customer_phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color="var(--dusty-rose)" />
                  <span>{order.customer_email || 'No email provided'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={14} color="#25D366" />
                  <span>WhatsApp Verified</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--dusty-rose)', fontWeight: 600, marginBottom: '10px' }}>
                Delivery Address
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <MapPin size={16} color="var(--dusty-rose)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <div>{order.address}</div>
                  <div>{order.city}, {order.state} - <strong>{order.pincode}</strong></div>
                </div>
              </div>

              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.80rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  {order.payment_method} ({order.payment_status})
                </span>
              </div>
            </div>
          </div>

          {/* Ordered Jewellery Items */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Ordered Jewellery Pieces ({order.items.length})
            </div>

            <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-blush-subtle)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 14px' }}>Item</th>
                    <th style={{ padding: '10px 14px' }}>SKU</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={it.image} alt={it.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{it.name}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--dusty-rose)' }}>{it.sku}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600 }}>{it.quantity}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>₹{it.price.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600 }}>₹{it.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Financial Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#237A4B' }}>
                  <span>Promotional Discount:</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? 'Free Shipping' : `₹${order.shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (GST):</span>
                <span>₹{order.tax}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700, color: 'var(--burgundy-deep)', borderTop: '2px solid var(--border-light)', paddingTop: '8px' }}>
                <span>Grand Total:</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
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
