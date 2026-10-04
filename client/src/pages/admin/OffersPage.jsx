import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Calendar,
  Percent,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import OfferModal from '../../components/admin/OfferModal';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

export default function OffersPage() {
  const { offers, deleteOffer, toggleOfferStatus } = useAdmin();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Active' | 'Scheduled' | 'Expired'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState(null);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  const filteredOffers = offers.filter(o => {
    if (activeTab === 'All') return true;
    return o.status === activeTab;
  });

  const handleOpenAdd = () => {
    setOfferToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer) => {
    setOfferToEdit(offer);
    setIsModalOpen(true);
  };

  const handlePromptDelete = (offer) => {
    setOfferToDelete(offer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (offerToDelete) {
      deleteOffer(offerToDelete.id);
      setIsDeleteModalOpen(false);
      setOfferToDelete(null);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '26px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Offers & Promotions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
            Configure discounts, seasonal promotions, and coupon rules for customer orders.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary"
          style={{ padding: '10px 22px' }}
        >
          <Plus size={16} />
          <span>+ Create Offer</span>
        </button>
      </div>

      {/* TABS: All, Active, Scheduled, Expired */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '14px',
          marginBottom: '28px'
        }}
      >
        {['All', 'Active', 'Scheduled', 'Expired'].map(tab => {
          const isActive = activeTab === tab;
          const count = tab === 'All' ? offers.length : offers.filter(o => o.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'var(--burgundy-deep)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--burgundy-deep)' : '1px solid var(--border-light)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isActive ? '0 2px 8px var(--burgundy-glow)' : 'none'
              }}
            >
              <span>{tab} Offers</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-blush-soft)',
                  color: isActive ? '#FFFFFF' : 'var(--dusty-rose)',
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* OFFERS CARDS GRID */}
      {filteredOffers.length === 0 ? (
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '60px 20px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
          <Tag size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '6px' }}>
            No Offers Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            There are no {activeTab !== 'All' ? activeTab.toLowerCase() : ''} promotion campaigns right now.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {filteredOffers.map(offer => {
            const isActive = offer.status === 'Active';
            const isScheduled = offer.status === 'Scheduled';
            const isExpired = offer.status === 'Expired';

            const statusColors = {
              Active: { bg: '#EBF8F0', text: '#237A4B', border: '#C8EEDB' },
              Scheduled: { bg: '#FFF6EA', text: '#B46410', border: '#FCE0BC' },
              Expired: { bg: '#FDF0F0', text: '#B8323E', border: '#F9D0D4' }
            };
            const s = statusColors[offer.status] || { bg: '#F5F5F5', text: '#666', border: '#DDD' };

            return (
              <div
                key={offer.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
                className="kpi-card-hover"
              >
                <div>
                  {/* Status & Discount badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span
                      style={{
                        background: s.bg,
                        color: s.text,
                        border: `1px solid ${s.border}`,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {offer.status}
                    </span>

                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Used: <strong>{offer.usage_count} times</strong>
                    </span>
                  </div>

                  {/* Title & Value */}
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {offer.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--burgundy-deep)', lineHeight: 1 }}>
                      {offer.discount_type === 'percentage' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} FLAT`}
                    </span>
                  </div>

                  {/* Details List */}
                  <div
                    style={{
                      background: 'var(--bg-blush-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '0.80rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '18px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} color="var(--dusty-rose)" />
                      <span>Valid: <strong>{offer.start_date}</strong> to <strong>{offer.end_date}</strong></span>
                    </div>

                    <div>
                      <span>Categories: </span>
                      <strong style={{ color: 'var(--text-main)' }}>
                        {offer.applicable_categories.join(', ')}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Min Order: <strong>₹{offer.min_order_value}</strong></span>
                      {offer.max_discount && <span>Max Cap: <strong>₹{offer.max_discount}</strong></span>}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '14px' }}>
                  <button
                    onClick={() => toggleOfferStatus(offer.id)}
                    style={{
                      background: 'transparent',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: isActive ? '#B8323E' : '#237A4B'
                    }}
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenEdit(offer)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handlePromptDelete(offer)}
                      style={{ background: '#FFF0F0', color: '#B8323E', padding: '6px 10px', borderRadius: '4px' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT OFFER MODAL */}
      <OfferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offerToEdit={offerToEdit}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Promotion Offer"
        message={`Are you sure you want to remove offer "${offerToDelete?.name}"?`}
        confirmLabel="Delete Offer"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

    </div>
  );
}
