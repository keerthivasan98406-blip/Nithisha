import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useAdmin();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className="animate-slide-up"
            style={{
              pointerEvents: 'auto',
              background: '#FFFFFF',
              border: `1px solid ${isSuccess ? '#C8EEDB' : isError ? '#F9D0D4' : 'var(--border-light)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 30px rgba(84, 20, 36, 0.12)',
              minWidth: '280px',
              maxWidth: '420px'
            }}
          >
            {isSuccess && <CheckCircle2 size={18} color="#237A4B" />}
            {isError && <AlertCircle size={18} color="#B8323E" />}
            {isInfo && <Info size={18} color="var(--dusty-rose)" />}

            <div style={{ flex: 1, fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: 500 }}>
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'transparent', padding: '2px', color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
