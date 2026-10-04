import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrderModal } from '../context/OrderModalContext';

export default function CartDrawer({ navigate }) {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { openCartCheckout } = useOrderModal();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    openCartCheckout(cart);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(35, 30, 32, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.12)'
        }}
      >
        {/* Header */}
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
            <ShoppingBag size={20} color="var(--accent-rosegold)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
              Shopping Bag ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'transparent', padding: '4px', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--bg-blush-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: 'var(--accent-rosegold)'
                }}
              >
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                Your bag is empty
              </h4>
              <p style={{ fontSize: '0.88rem', marginBottom: '24px' }}>
                Discover our curated fancy jewellery collection and add your favorite pieces.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '10px 20px' }}
              >
                Browse Jewellery
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: '#FFFFFF'
                  }}
                >
                  <img
                    src={item.primary_image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80'}
                    alt={item.name}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {item.code}
                      </div>
                      <h4
                        style={{
                          fontSize: '0.95rem',
                          fontFamily: 'var(--font-serif)',
                          fontWeight: 500,
                          lineHeight: 1.3,
                          marginBottom: '4px'
                        }}
                      >
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        ₹{item.selling_price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-light)',
                          borderRadius: '4px',
                          background: 'var(--bg-blush-subtle)'
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ padding: '2px 8px', background: 'transparent' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 6px' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ padding: '2px 8px', background: 'transparent' }}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'transparent', color: '#D64045', padding: '4px' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--border-light)',
              background: 'var(--bg-blush-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Subtotal:</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-rosegold-dark)' }}>
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Enter your address on next step to prepare your WhatsApp order message.
            </p>

            <button
              onClick={handleCheckout}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.88rem' }}
            >
              <span>Place Order via WhatsApp</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
