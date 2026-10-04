import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ShopByCategory({ navigate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load categories', err);
        setLoading(false);
      });
  }, []);

  return (
    <section style={{ padding: '80px 0 60px 0' }}>
      <div className="container">
        

        {/* Categories Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div
                key={i}
                style={{
                  height: '320px',
                  background: 'var(--bg-blush-soft)',
                  borderRadius: 'var(--radius-md)',
                  animation: 'pulse 1.5s infinite'
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/shop?category=${cat.slug}`)}
                className="category-card"
                style={{
                  position: 'relative',
                  height: '340px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-card)',
                  background: 'var(--bg-surface)'
                }}
              >
                {/* Background Image */}
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                  className="cat-img"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(35, 30, 32, 0.85) 0%, rgba(35, 30, 32, 0.2) 50%, transparent 100%)',
                    transition: 'background 0.3s ease'
                  }}
                />

                {/* Content Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h3
                      style={{
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.5rem',
                        fontWeight: 500,
                        marginBottom: '4px'
                      }}
                    >
                      {cat.name}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.82rem', letterSpacing: '0.04em' }}>
                      {cat.available_count ?? cat.product_count ?? 0} Designs
                    </p>
                  </div>

                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                      transition: 'all 0.3s ease'
                    }}
                    className="cat-icon"
                  >
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        .category-card:hover .cat-img {
          transform: scale(1.08);
        }
        .category-card:hover .cat-icon {
          background: var(--accent-rosegold) !important;
          transform: rotate(45deg);
        }
      `}</style>
    </section>
  );
}
