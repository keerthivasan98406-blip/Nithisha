import React, { useState, useEffect } from 'react';
import { X, Tag, Check } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function OfferModal({ isOpen, onClose, offerToEdit }) {
  const { addOffer, updateOffer } = useAdmin();
  const isEdit = !!offerToEdit;

  const [form, setForm] = useState({
    name: '',
    discount_type: 'percentage',
    discount_value: 15,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    applicable_categories: ['All'],
    min_order_value: 999,
    max_discount: 300,
    status: 'Active'
  });

  useEffect(() => {
    if (offerToEdit) {
      setForm(offerToEdit);
    } else {
      setForm({
        name: '',
        discount_type: 'percentage',
        discount_value: 15,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        applicable_categories: ['All'],
        min_order_value: 999,
        max_discount: 300,
        status: 'Active'
      });
    }
  }, [offerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateOffer(offerToEdit.id, form);
    } else {
      addOffer(form);
    }
    onClose();
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
          maxWidth: '560px',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-blush-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={18} color="var(--dusty-rose)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600 }}>
              {isEdit ? 'Edit Promotion Offer' : 'Create Promotion Offer'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              Offer / Promotion Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Summer Sparkle 15% Off"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Discount Type
              </label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Discount Value *
              </label>
              <input
                type="number"
                required
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Start Date
              </label>
              <input
                type="date"
                required
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                End Date
              </label>
              <input
                type="date"
                required
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Minimum Order Value (₹)
              </label>
              <input
                type="number"
                value={form.min_order_value}
                onChange={(e) => setForm({ ...form, min_order_value: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                Maximum Discount Cap (₹)
              </label>
              <input
                type="number"
                value={form.max_discount}
                onChange={(e) => setForm({ ...form, max_discount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} />
              <span>{isEdit ? 'Save Changes' : 'Create Offer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
