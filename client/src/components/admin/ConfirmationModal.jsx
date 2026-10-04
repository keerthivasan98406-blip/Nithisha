import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  confirmVariant = 'danger',
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-modal)',
          width: '100%',
          maxWidth: '440px',
          padding: '28px',
          border: '1px solid var(--border-light)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: confirmVariant === 'danger' ? '#FDF0F0' : 'var(--bg-blush-soft)',
              color: confirmVariant === 'danger' ? '#B8323E' : 'var(--burgundy-deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {message}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '26px' }}>
          <button
            onClick={onCancel}
            className="btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: confirmVariant === 'danger' ? '#B8323E' : 'var(--dusty-rose)',
              color: '#FFFFFF',
              padding: '8px 20px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              fontWeight: 500,
              boxShadow: confirmVariant === 'danger' ? '0 4px 12px rgba(184, 50, 62, 0.25)' : '0 4px 12px var(--dusty-rose-glow)'
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
