import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useOrderModal } from '../context/OrderModalContext';

export default function ProductCard({ product, navigate }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openBuyNow } = useOrderModal();

  const isFavorited = isInWishlist(product.id);
  const isAvailable = product.availability === 'available';
  const displayImage = product.primary_image || (product.images && product.images[0] ? product.images[0].image_url : 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80');

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleBuyNowClick = (e) => {
    e.stopPropagation();
    if (isAvailable) {
      openBuyNow(product, 1);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="product-card"
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform var(--transition-smooth), box-shadow var(--transition-smooth), border-color var(--transition-smooth)'
      }}
    >
      {/* Product Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1/1.05',
          overflow: 'hidden',
          background: 'var(--bg-blush-soft)'
        }}
      >
        <img
          src={displayImage}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
          className="prod-thumb"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            color: isFavorited ? '#D64045' : 'var(--text-secondary)',
            transition: 'transform 0.2s ease, background-color 0.2s ease'
          }}
          className="wishlist-btn"
        >
          <Heart size={18} fill={isFavorited ? '#D64045' : 'none'} />
        </button>

        {/* Availability Badge */}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
          {isAvailable ? (
            <span className="badge-available">Available</span>
          ) : (
            <span className="badge-soldout">Sold Out</span>
          )}
        </div>
      </div>

      {/* Product Card Details */}
      <div
        style={{
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Product Code */}
          <div
            style={{
              fontSize: '0.74rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '4px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500
            }}
          >
            {product.code}
          </div>

          {/* Product Name */}
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.18rem',
              fontWeight: 500,
              lineHeight: 1.35,
              color: 'var(--text-main)',
              marginBottom: '10px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              marginBottom: '16px'
            }}
          >
            ₹{product.selling_price.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Action Button: BUY NOW */}
        <div>
          <button
            onClick={handleBuyNowClick}
            disabled={!isAvailable}
            style={{
              width: '100%',
              background: isAvailable ? 'var(--accent-rosegold)' : '#E6DFDF',
              color: isAvailable ? '#FFFFFF' : '#8C8284',
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: isAvailable ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: isAvailable ? '0 3px 12px var(--accent-rosegold-glow)' : 'none'
            }}
            className={isAvailable ? 'btn-buy-now' : ''}
          >
            <ShoppingBag size={15} />
            <span>{isAvailable ? 'BUY NOW' : 'OUT OF STOCK'}</span>
          </button>
        </div>
      </div>

      <style>{`
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
          border-color: var(--border-hover);
        }
        .product-card:hover .prod-thumb {
          transform: scale(1.06);
        }
        .wishlist-btn:hover {
          transform: scale(1.12);
        }
        .btn-buy-now:hover {
          background: var(--accent-rosegold-hover) !important;
        }
      `}</style>
    </div>
  );
}
