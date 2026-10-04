import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft, Shield, Sparkles, Truck, Check, Share2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useOrderModal } from '../context/OrderModalContext';

export default function ProductDetailsPage({ productId, navigate }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { openBuyNow } = useOrderModal();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setSelectedImageIndex(0);
        setQuantity(1);
        setLoading(false);

        // Fetch related products in same category
        if (data.category_id) {
          fetch(`/api/products?category=${data.category_id}&limit=4`)
            .then(r => r.json())
            .then(rel => setRelatedProducts(rel.filter(p => p.id !== data.id)))
            .catch(console.error);
        }
      })
      .catch(err => {
        console.error('Error fetching product', err);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading exquisite jewellery details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '12px' }}>
          Product Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          The jewellery piece you are looking for is unavailable or has been archived.
        </p>
        <button onClick={() => navigate('/shop')} className="btn-primary">
          Back to Shop
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isAvailable = product.availability === 'available';
  const images = (product.images && product.images.length > 0)
    ? product.images.map(i => i.image_url)
    : [product.primary_image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'];

  const activeImage = images[selectedImageIndex] || images[0];

  return (
    <div style={{ padding: '32px 0 80px 0' }}>
      <div className="container">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/shop')}
          style={{
            background: 'transparent',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            marginBottom: '28px',
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Catalogue</span>
        </button>

        {/* Product Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: '54px',
            alignItems: 'start'
          }}
          className="product-details-grid"
        >
          
          {/* Left: Image Gallery */}
          <div>
            {/* Primary Large Image */}
            <div
              style={{
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: '#FFFFFF',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-light)',
                marginBottom: '16px'
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: idx === selectedImageIndex ? '2px solid var(--accent-rosegold)' : '1px solid var(--border-light)',
                      padding: 0,
                      opacity: idx === selectedImageIndex ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Purchase Action */}
          <div>
            
            {/* Category & Code */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.76rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-rosegold-dark)', fontWeight: 600 }}>
                {product.category_name || 'Fashion Jewellery'}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                CODE: {product.code}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
                lineHeight: 1.25,
                color: 'var(--text-main)',
                marginBottom: '16px'
              }}
            >
              {product.name}
            </h1>

            {/* Price & Availability Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-main)' }}>
                ₹{product.selling_price.toLocaleString('en-IN')}
              </div>
              <div>
                {isAvailable ? (
                  <span className="badge-available">Available in Stock</span>
                ) : (
                  <span className="badge-soldout">Sold Out</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginBottom: '28px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.7 }}>
                {product.description}
              </p>
            </div>

            {/* Specification chips */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                background: 'var(--bg-blush-subtle)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '28px',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Colour Tone: </span>
                <strong>{product.colour || 'Rose Gold'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Category: </span>
                <strong>{product.category_name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Finish: </span>
                <strong>Anti-Tarnish Polish</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Fastening: </span>
                <strong>Hypoallergenic</strong>
              </div>
            </div>

            {/* Quantity Selector */}
            {isAvailable && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>Quantity:</span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-hover)',
                    borderRadius: 'var(--radius-sm)',
                    background: '#FFFFFF'
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '6px 14px', background: 'transparent', fontSize: '1.1rem' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 8px', fontWeight: 600, fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '6px 14px', background: 'transparent', fontSize: '1.1rem' }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Buttons: BUY NOW & WISHLIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <button
                onClick={() => isAvailable && openBuyNow(product, quantity)}
                disabled={!isAvailable}
                className="btn-primary"
                style={{
                  padding: '16px',
                  fontSize: '0.95rem',
                  letterSpacing: '0.06em',
                  width: '100%',
                  background: isAvailable ? 'var(--accent-rosegold)' : '#DDD'
                }}
              >
                <ShoppingBag size={18} />
                <span>{isAvailable ? 'BUY NOW (WHATSAPP ORDER)' : 'CURRENTLY OUT OF STOCK'}</span>
              </button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={!isAvailable}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn-secondary"
                  style={{
                    padding: '12px 20px',
                    borderColor: isFavorited ? '#D64045' : 'var(--border-hover)',
                    color: isFavorited ? '#D64045' : 'var(--text-main)'
                  }}
                >
                  <Heart size={18} fill={isFavorited ? '#D64045' : 'none'} />
                  <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Care Instructions Accordion */}
            <div
              style={{
                borderTop: '1px solid var(--border-light)',
                paddingTop: '20px'
              }}
            >
              <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '10px' }}>
                Jewellery Care Instructions
              </h4>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6 }}>
                <li>Keep away from direct perfumes, sanitizers, and pool chemicals.</li>
                <li>Store individually in an airtight zip pouch or soft velvet box.</li>
                <li>Gently wipe with a soft dry lint-free cloth after wear.</li>
                <li>Remove before showering, swimming, or rigorous workouts.</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '90px', borderTop: '1px solid var(--border-light)', paddingTop: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span style={{ fontSize: '0.76rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-rosegold-dark)', fontWeight: 600 }}>
                Complete The Look
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '4px' }}>
                You May Also Love
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '24px'
              }}
            >
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} navigate={navigate} />
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 860px) {
          .product-details-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </div>
  );
}
