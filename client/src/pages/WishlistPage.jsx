import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useOrderModal } from '../context/OrderModalContext';

export default function WishlistPage({ navigate }) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { openBuyNow } = useOrderModal();

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '36px', textAlign: 'center' }}>
          <span
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--accent-rosegold-dark)'
            }}
          >
            Saved Pieces
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 2.8rem)', marginTop: '4px' }}>
            My Wishlist ({wishlist.length})
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
            Your curated favorites, ready for instant WhatsApp ordering without mandatory registration.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              maxWidth: '560px',
              margin: '0 auto'
            }}
          >
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
                color: 'var(--accent-rosegold-dark)'
              }}
            >
              <Heart size={30} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '8px' }}>
              Your Wishlist is Empty
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Save the pieces that catch your eye while exploring our boutique catalogue.
            </p>
            <button onClick={() => navigate('/shop')} className="btn-primary">
              <span>Browse Jewellery</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '28px'
            }}
          >
            {wishlist.map((item) => {
              const isAvailable = item.availability === 'available';
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Image */}
                  <div
                    onClick={() => navigate(`/product/${item.id}`)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1/1',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: 'var(--bg-blush-soft)'
                    }}
                  >
                    <img
                      src={item.primary_image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                      {isAvailable ? (
                        <span className="badge-available">Available</span>
                      ) : (
                        <span className="badge-soldout">Sold Out</span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {item.code}
                      </div>
                      <h3
                        onClick={() => navigate(`/product/${item.id}`)}
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.15rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          marginBottom: '8px'
                        }}
                      >
                        {item.name}
                      </h3>
                      <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>
                        ₹{item.selling_price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => isAvailable && openBuyNow(item, 1)}
                        disabled={!isAvailable}
                        className="btn-primary"
                        style={{
                          flex: 1,
                          padding: '10px',
                          fontSize: '0.82rem',
                          background: isAvailable ? 'var(--accent-rosegold)' : '#DDD'
                        }}
                      >
                        <ShoppingBag size={14} />
                        <span>{isAvailable ? 'BUY NOW' : 'OUT OF STOCK'}</span>
                      </button>

                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="btn-secondary"
                        style={{ padding: '10px 12px', color: '#D64045' }}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
