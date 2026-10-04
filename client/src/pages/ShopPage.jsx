import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { X, Search } from 'lucide-react';

export default function ShopPage({ navigate, initialCategory = '', initialSearch = '' }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('price_asc');

  // Sync initialCategory & initialSearch on URL navigation
  useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Load Categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  // Fetch Products based on active category, search, and sort
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (sortBy) params.append('sort', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products', err);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery, sortBy]);

  const totalPiecesCount = categories.reduce((acc, c) => acc + (c.available_count ?? c.product_count ?? 0), 0);

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        
        {/* Shop Page Banner */}
        <div style={{ marginBottom: '32px' }}>
          <span
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--accent-rosegold-dark)'
            }}
          >
            Jewellery Catalogue
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', marginTop: '4px', fontWeight: 500 }}>
            {selectedCategory ? `${categories.find(c => c.slug === selectedCategory)?.name || 'Category'} Collection` : 'All Fancy Jewellery'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
            Showing {products.length} designs available for direct WhatsApp ordering.
          </p>
        </div>

        {/* Top Controls: Search Bar & Filter Dropdowns (Category on the Left of Sort By) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 280px', maxWidth: '400px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search name or code (e.g. ER-1024)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px', height: '42px', width: '100%' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Right Controls: Category Dropdown (Left of Sort By) & Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            
            {/* Category Dropdown (placed to the left of Sort By) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '0.84rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '8px 12px',
                  width: 'auto',
                  minWidth: '180px',
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: '#FFFFFF',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">All Categories {totalPiecesCount > 0 ? `(${totalPiecesCount})` : ''}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({cat.available_count ?? cat.product_count ?? 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '0.84rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 12px',
                  width: 'auto',
                  minWidth: '160px',
                  height: '42px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: '#FFFFFF',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>

          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategory || searchQuery) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active filters:</span>
            {selectedCategory && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-blush-soft)',
                  color: 'var(--accent-rosegold-dark)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  border: '1px solid var(--border-light)'
                }}
              >
                Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                <button
                  onClick={() => setSelectedCategory('')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex', alignItems: 'center' }}
                  title="Clear Category"
                >
                  <X size={13} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-blush-soft)',
                  color: 'var(--accent-rosegold-dark)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  border: '1px solid var(--border-light)'
                }}
              >
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex', alignItems: 'center' }}
                  title="Clear Search"
                >
                  <X size={13} />
                </button>
              </span>
            )}
            <button
              onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.78rem', textDecoration: 'underline', padding: '2px 6px' }}
            >
              Reset all
            </button>
          </div>
        )}

        {/* Product Grid (Full Width) */}
        <main>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div
                  key={i}
                  style={{
                    height: '380px',
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)'
                  }}
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '8px' }}>
                No Jewellery Found
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                We couldn't find any pieces matching your current filters.
              </p>
              <button onClick={() => { setSelectedCategory(''); setSearchQuery(''); }} className="btn-primary" style={{ fontSize: '0.84rem' }}>
                Show All Products
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
              {products.map(product => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
