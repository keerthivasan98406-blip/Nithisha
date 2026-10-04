import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Copy, CheckCircle2, AlertTriangle, Eye, Upload, Image as ImageIcon, Sparkles, LayoutGrid, List } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State (Add or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category_id: '',
    description: '',
    purchase_cost: '',
    selling_price: '',
    stock_quantity: 10,
    availability: 'available',
    colour: 'Rose Gold',
    is_featured: false,
    images: [''] // array of image URLs
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && !formData.category_id) {
          setFormData(prev => ({ ...prev, category_id: data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Real-time calculations: Profit & Margin
  const sellPriceNum = Number(formData.selling_price) || 0;
  const costNum = Number(formData.purchase_cost) || 0;
  const profitPerItem = sellPriceNum - costNum;
  const profitMargin = sellPriceNum > 0 ? ((profitPerItem / sellPriceNum) * 100).toFixed(2) : 0;

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingId(null);
    setFormData({
      name: '',
      code: 'JW-' + Math.floor(1000 + Math.random() * 9000),
      category_id: categories[0]?.id || '',
      description: '',
      purchase_cost: '',
      selling_price: '',
      stock_quantity: 10,
      availability: 'available',
      colour: 'Rose Gold',
      is_featured: false,
      images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setModalMode('edit');
    setEditingId(product.id);
    const existingImages = product.images && product.images.length > 0
      ? product.images.map(i => i.image_url)
      : [product.primary_image || ''];

    setFormData({
      name: product.name,
      code: product.code,
      category_id: product.category_id,
      description: product.description,
      purchase_cost: product.purchase_cost,
      selling_price: product.selling_price,
      stock_quantity: product.stock_quantity,
      availability: product.availability,
      colour: product.colour || 'Rose Gold',
      is_featured: !!product.is_featured,
      images: existingImages
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'available' ? 'sold_out' : 'available';
    try {
      const res = await fetch(`/api/products/${id}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ availability: nextStatus })
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (id) => {
    if (!confirm('Duplicate this product to create a clone?')) return;
    try {
      const res = await fetch(`/api/products/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Image upload handler
  const handleFileUpload = async (e, slotIndex = null) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingImage(true);
    try {
      if (files.length === 1) {
        const data = new FormData();
        data.append('image', files[0]);
        const res = await fetch('/api/upload/single', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: data
        });
        if (res.ok) {
          const uploadRes = await res.json();
          setFormData(prev => {
            const nextImages = [...prev.images];
            if (slotIndex !== null && slotIndex >= 0) {
              nextImages[slotIndex] = uploadRes.url;
            } else {
              if (!nextImages.includes(uploadRes.url)) {
                nextImages.unshift(uploadRes.url);
              }
            }
            return {
              ...prev,
              images: nextImages.filter(Boolean)
            };
          });
        } else {
          alert('Image upload failed. Ensure file is JPG/PNG/WebP under 5MB.');
        }
      } else {
        const data = new FormData();
        files.forEach(f => data.append('images', f));
        const res = await fetch('/api/upload/multiple', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: data
        });
        if (res.ok) {
          const uploaded = await res.json();
          const newUrls = uploaded.map(u => u.url);
          setFormData(prev => ({
            ...prev,
            images: [...newUrls, ...prev.images.filter(Boolean)]
          }));
        } else {
          alert('Multiple image upload failed.');
        }
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      purchase_cost: Number(formData.purchase_cost || 0),
      selling_price: Number(formData.selling_price),
      stock_quantity: Number(formData.stock_quantity || 0),
      images: formData.images.filter(img => img.trim() !== '')
    };

    try {
      const url = modalMode === 'add' ? '/api/products' : `/api/products/${editingId}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to save product');
      }
    } catch (err) {
      alert('Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchSearch = !search.trim() || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || String(p.category_id) === String(categoryFilter);
    return matchSearch && matchCat;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 600 }}>
            Jewellery Products Catalogue
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px' }}>
            Manage designs, pricing, costs, real-time margins, and instant stock availability.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.86rem' }}>
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 280px', maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Filter by name or code (e.g. ER-1024)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px 12px', height: '38px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: '8px 12px', width: 'auto', minWidth: '180px', height: '38px' }}
            >
              <option value="">All Categories ({products.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* View Switcher: Cards (default) or Table */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-blush-soft)', padding: '3px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 500,
                background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'grid' ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              title="Cards Grid View"
            >
              <LayoutGrid size={15} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 500,
                background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'table' ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              title="Table View"
            >
              <List size={15} />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          Loading catalogue products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          No products matching your search criteria.
        </div>
      ) : viewMode === 'grid' ? (
        /* Products Cards Grid - Structure matching category cards screenshot */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredProducts.map((p, index) => {
            const profit = p.selling_price - p.purchase_cost;
            const margin = p.selling_price > 0 ? ((profit / p.selling_price) * 100).toFixed(1) : 0;
            const isAvailable = p.availability === 'available';
            const imgSrc = p.primary_image || (p.images && p.images[0]?.image_url) || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={p.id}
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
                {/* Cover Image */}
                <div style={{ height: '180px', position: 'relative', background: 'var(--bg-blush-soft)', overflow: 'hidden' }}>
                  <img
                    src={imgSrc}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(6px)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      color: 'var(--text-main)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                    }}
                  >
                    Order: #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(p.id, p.availability)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: isAvailable ? 'rgba(255, 255, 255, 0.95)' : 'rgba(253, 242, 242, 0.95)',
                      color: isAvailable ? '#4F8A68' : '#C96B6B',
                      border: '1px solid ' + (isAvailable ? 'rgba(79, 138, 104, 0.25)' : 'rgba(201, 107, 107, 0.25)'),
                      backdropFilter: 'blur(6px)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                    title="Click to toggle Available / Sold Out"
                  >
                    {isAvailable ? 'Available' : 'Sold Out'}
                  </button>
                </div>

                {/* Info */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px', gap: '8px' }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={p.name}
                      >
                        {p.name}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: isAvailable ? 'var(--accent-rosegold-dark)' : '#C96B6B',
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {p.stock_quantity} in stock
                      </span>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '8px' }}>
                      slug: /{p.code ? p.code.toLowerCase() : 'product'} {p.category_name ? `• ${p.category_name}` : ''}
                    </div>

                    <p
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        marginBottom: '12px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.55em'
                      }}
                    >
                      {p.description || 'No description provided.'}
                    </p>

                    {/* Financial summary: Selling price, Cost, Margin */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-blush-soft)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '14px'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Selling Price
                        </span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>
                          ₹{Number(p.selling_price || 0).toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
                          Cost: ₹{Number(p.purchase_cost || 0).toLocaleString('en-IN')}
                        </span>
                        <span style={{ color: '#4F8A68', fontWeight: 600, fontSize: '0.76rem' }}>
                          +₹{profit.toLocaleString('en-IN')} ({margin}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDuplicate(p.id)}
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rosegold-dark)' }}
                      title="Duplicate Product"
                    >
                      <Copy size={14} />
                      <span>Duplicate</span>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      style={{
                        background: '#FDF2F2',
                        color: '#C96B6B',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Products Table View */
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-blush-subtle)', borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '14px 16px' }}>Thumbnail</th>
                  <th style={{ padding: '14px 16px' }}>Code</th>
                  <th style={{ padding: '14px 16px' }}>Product Name</th>
                  <th style={{ padding: '14px 16px' }}>Category</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Selling Price</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Purchase Cost</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Profit / Item</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Margin %</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>Stock</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const profit = p.selling_price - p.purchase_cost;
                  const margin = p.selling_price > 0 ? ((profit / p.selling_price) * 100).toFixed(1) : 0;
                  const isAvailable = p.availability === 'available';

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <img
                          src={p.primary_image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=120&q=80'}
                          alt={p.name}
                          style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-rosegold-dark)' }}>
                        {p.code}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-main)', maxWidth: '220px' }}>
                        {p.name}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        {p.category_name}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                        ₹{p.selling_price.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>
                        ₹{p.purchase_cost.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#4F8A68' }}>
                        ₹{profit.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span style={{ background: '#EFF7F2', color: '#4F8A68', padding: '3px 8px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 600 }}>
                          {margin}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 500 }}>
                        {p.stock_quantity}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleAvailability(p.id, p.availability)}
                          style={{
                            background: isAvailable ? 'var(--status-available-bg)' : 'var(--status-soldout-bg)',
                            color: isAvailable ? 'var(--status-available-text)' : 'var(--status-soldout-text)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}
                          title="Click to toggle Available / Sold Out"
                        >
                          {isAvailable ? 'Available' : 'Sold Out'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            style={{ background: 'transparent', padding: '6px', color: 'var(--text-secondary)', borderRadius: '4px' }}
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(p.id)}
                            style={{ background: 'transparent', padding: '6px', color: 'var(--accent-rosegold-dark)', borderRadius: '4px' }}
                            title="Duplicate Product"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            style={{ background: 'transparent', padding: '6px', color: '#C96B6B', borderRadius: '4px' }}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT WITH REAL-TIME PROFIT & MARGIN CALCULATIONS */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-modal)',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--border-light)'
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
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>
                  {modalMode === 'add' ? 'Add Fancy Jewellery Product' : 'Edit Product'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Enter selling price and purchase cost for automatic profit & margin calculation.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', padding: '4px' }}>
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                {/* Product Name */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pearl Drop Chandelier Earrings"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Product Code */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Product Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ER-1024"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    required
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Section 18: Purchase Cost & Selling Price with Live Profit Calculator */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Purchase Cost (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="250"
                    value={formData.purchase_cost}
                    onChange={(e) => setFormData({ ...formData, purchase_cost: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="499"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                  />
                </div>

                {/* AUTOMATIC REAL-TIME PROFIT BOX */}
                <div
                  style={{
                    gridColumn: 'span 2',
                    background: '#EFF7F2',
                    border: '1px solid #CCE8D8',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4F8A68', fontWeight: 600 }}>
                      AUTOMATIC PROFIT CALCULATION
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4F8A68', marginTop: '2px' }}>
                      Profit Per Item: ₹{profitPerItem.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4F8A68', fontWeight: 600 }}>
                      PROFIT MARGIN
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4F8A68', marginTop: '2px' }}>
                      {profitMargin}%
                    </div>
                  </div>
                </div>

                {/* Stock & Availability */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  >
                    <option value="available">Available in Stock</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                </div>

                {/* Colour */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Colour Tone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rose Gold & Blush Pink"
                    value={formData.colour}
                    onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '28px' }}>
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-rosegold)' }}
                  />
                  <label htmlFor="is_featured" style={{ fontSize: '0.86rem', cursor: 'pointer' }}>
                    Feature on Homepage
                  </label>
                </div>

                {/* Description */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe aesthetics, materials, hypoallergenic posts, occasion wear..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Image URLs & Upload */}
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                      Product Images (Main thumbnail + Additional angles)
                    </label>
                    <label
                      style={{
                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#FFF',
                        background: 'var(--accent-rosegold-dark, #A85568)',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Upload size={14} />
                      <span>{uploadingImage ? 'Uploading...' : '📁 Upload Image File(s)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e)}
                        disabled={uploadingImage}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  {formData.images.map((imgUrl, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={`Preview ${index + 1}`}
                          style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #DDD' }}
                        />
                      ) : (
                        <div style={{ width: '38px', height: '38px', borderRadius: '4px', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.70rem', color: '#999' }}>
                          #{index + 1}
                        </div>
                      )}
                      
                      <input
                        type="text"
                        placeholder={index === 0 ? "Main image URL or upload file..." : `Image ${index + 1} URL or upload file...`}
                        value={imgUrl}
                        onChange={(e) => {
                          const next = [...formData.images];
                          next[index] = e.target.value;
                          setFormData({ ...formData, images: next });
                        }}
                        style={{ flex: 1 }}
                      />

                      <label
                        style={{
                          cursor: uploadingImage ? 'not-allowed' : 'pointer',
                          fontSize: '0.75rem',
                          padding: '6px 10px',
                          border: '1px solid var(--border-color, #E2E8F0)',
                          borderRadius: '4px',
                          background: '#FFF',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Upload file for this slot"
                      >
                        <Upload size={12} />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, index)}
                          disabled={uploadingImage}
                          style={{ display: 'none' }}
                        />
                      </label>

                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
                          }}
                          style={{ background: 'transparent', color: '#C96B6B', padding: '0 8px', fontSize: '1.1rem' }}
                          title="Remove image slot"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                    style={{ background: 'transparent', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-rosegold-dark, #A85568)', padding: '4px 0' }}
                  >
                    + Add Another Image Slot
                  </button>
                </div>

              </div>

              <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Saving...' : (modalMode === 'add' ? 'Create Product' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
