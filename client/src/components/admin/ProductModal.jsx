import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Check, Sparkles, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function ProductModal({ isOpen, onClose, productToEdit }) {
  const { addProduct, updateProduct, showToast } = useAdmin();

  const isEditMode = !!productToEdit;

  const [activeTab, setActiveTab] = useState('basic');

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Earrings',
    short_description: '',
    detailed_description: '',
    cost_price: '',
    selling_price: '',
    stock: 15,
    low_stock_threshold: 8,
    image: '',
    images: [],
    seo_title: '',
    meta_description: '',
    url_slug: '',
    is_featured: false,
    is_active: true,
    tags: 'Jewellery, Rose Gold',
    weight: '12g',
    material: 'High-grade Brass Alloy, Anti-Tarnish 18K Rose Gold Dip',
    size: 'Standard Adjustable',
    colour: 'Rose Gold',
    collection: 'Petal Whisper'
  });

  useEffect(() => {
    if (productToEdit) {
      setForm({
        ...productToEdit,
        tags: Array.isArray(productToEdit.tags) ? productToEdit.tags.join(', ') : (productToEdit.tags || ''),
        images: productToEdit.images || [productToEdit.image]
      });
    } else {
      setForm({
        name: '',
        sku: `JW-${Math.floor(1000 + Math.random() * 9000)}`,
        category: 'Earrings',
        short_description: '',
        detailed_description: '',
        cost_price: 200,
        selling_price: 499,
        stock: 20,
        low_stock_threshold: 6,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'
        ],
        seo_title: '',
        meta_description: '',
        url_slug: '',
        is_featured: false,
        is_active: true,
        tags: 'Earrings, Fashion Jewellery, Rose Gold',
        weight: '10g',
        material: 'Anti-tarnish Copper Alloy, AAAAA Cubic Zirconia',
        size: 'Standard',
        colour: 'Rose Gold',
        collection: 'Petal Whisper'
      });
    }
    setActiveTab('basic');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Real-time automatic profit calculation
  const sellNum = Number(form.selling_price) || 0;
  const costNum = Number(form.cost_price) || 0;
  const calculatedProfit = sellNum - costNum;
  const calculatedMargin = sellNum > 0 ? ((calculatedProfit / sellNum) * 100).toFixed(2) : 0;

  const handleChange = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !isEditMode) {
        next.url_slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        next.seo_title = `${value} | LURELLE Jewellery`;
      }
      return next;
    });
  };

  const handleAddImageUrl = (url) => {
    if (!url.trim()) return;
    setForm(prev => ({
      ...prev,
      images: [...prev.images, url.trim()],
      image: prev.image || url.trim()
    }));
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleModalFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const data = new FormData();
      if (files.length === 1) {
        data.append('image', files[0]);
        const res = await fetch('/api/upload/single', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}` },
          body: data
        });
        if (res.ok) {
          const json = await res.json();
          handleAddImageUrl(json.url);
          showToast('Image uploaded successfully', 'success');
        } else {
          showToast('Image upload failed', 'error');
        }
      } else {
        files.forEach(file => data.append('images', file));
        const res = await fetch('/api/upload/multiple', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}` },
          body: data
        });
        if (res.ok) {
          const json = await res.json();
          json.forEach(item => handleAddImageUrl(item.url));
          showToast(`${json.length} images uploaded successfully`, 'success');
        } else {
          showToast('Multiple image upload failed', 'error');
        }
      }
    } catch (err) {
      showToast('Error uploading image file', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setForm(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || ''
      };
    });
  };

  const handleSetPrimary = (url) => {
    setForm(prev => ({
      ...prev,
      image: url
    }));
    showToast('Primary image updated', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Please enter a product name', 'error');
      return;
    }

    const payload = {
      ...form,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      image: form.image || form.images[0] || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      images: form.images.length > 0 ? form.images : [form.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80']
    };

    if (isEditMode) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'pricing', label: 'Pricing & Inventory' },
    { id: 'images', label: 'Images' },
    { id: 'seo', label: 'SEO' },
    { id: 'more', label: 'More Options' }
  ];

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
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-blush-subtle)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--dusty-rose)', fontWeight: 600 }}>
              {isEditMode ? 'Catalogue Editor' : 'New Jewellery Piece'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
              Product Details
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => showToast('Previewing item on website catalogue...', 'info')}
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: '0.80rem' }}
            >
              <ExternalLink size={13} />
              <span>View on Website</span>
            </button>

            <button
              onClick={onClose}
              style={{ background: 'transparent', padding: '6px', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-light)',
            padding: '0 28px',
            background: '#FFFFFF',
            overflowX: 'auto'
          }}
        >
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '12px 18px',
                fontSize: '0.86rem',
                fontWeight: activeTab === t.id ? 600 : 500,
                color: activeTab === t.id ? 'var(--burgundy-deep)' : 'var(--text-secondary)',
                borderBottom: activeTab === t.id ? '2px solid var(--burgundy-deep)' : '2px solid transparent',
                background: 'transparent',
                whiteSpace: 'nowrap'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
            
            {/* TAB 1: BASIC INFORMATION */}
            {activeTab === 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Luxe French Baroque Pearl Chandelier Earrings"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      SKU / Product Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ER-1024"
                      value={form.sku}
                      onChange={(e) => handleChange('sku', e.target.value)}
                      style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--dusty-rose)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Jewellery Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    <option value="Earrings">Earrings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Rings">Rings</option>
                    <option value="Pendants">Pendants</option>
                    <option value="Sets">Sets</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Short Summary (Displayed on cards)
                  </label>
                  <input
                    type="text"
                    placeholder="Brief 1-sentence highlight of the design..."
                    value={form.short_description}
                    onChange={(e) => handleChange('short_description', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Detailed Boutique Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the craftsmanship, materials, closure, comfort and styling notes..."
                    value={form.detailed_description}
                    onChange={(e) => handleChange('detailed_description', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: PRICING & INVENTORY (WITH AUTOMATIC PROFIT CALCULATION) */}
            {activeTab === 'pricing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                
                {/* Real-time Profit Calculation Banner */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #FDF4F6 0%, #FAF0F2 100%)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px 24px',
                    border: '1px solid var(--border-hover)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    textAlign: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                      SELLING PRICE
                    </span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      ₹{sellNum.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                      PROFIT PER PIECE
                    </span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: calculatedProfit >= 0 ? '#237A4B' : '#B8323E', marginTop: '2px' }}>
                      ₹{calculatedProfit.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                      Selling - Cost
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                      PROFIT MARGIN
                    </span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#541424', marginTop: '2px' }}>
                      {calculatedMargin}%
                    </div>
                    <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
                      Profit / Selling × 100
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Cost Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="210"
                      value={form.cost_price}
                      onChange={(e) => handleChange('cost_price', e.target.value)}
                    />
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Internal procurement / manufacturing cost.
                    </p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="499"
                      value={form.selling_price}
                      onChange={(e) => handleChange('selling_price', e.target.value)}
                    />
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Customer price displayed on WhatsApp catalogue.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      value={form.stock}
                      onChange={(e) => handleChange('stock', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Low Stock Alert Threshold
                    </label>
                    <input
                      type="number"
                      value={form.low_stock_threshold}
                      onChange={(e) => handleChange('low_stock_threshold', e.target.value)}
                    />
                  </div>
                </div>

                {/* Stock Status Preview Badge */}
                <div style={{ padding: '12px 16px', background: '#FAFAF8', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Calculated Inventory Status:</span>
                  <div>
                    {Number(form.stock) <= 0 ? (
                      <span className="badge-outstock">Out of Stock</span>
                    ) : Number(form.stock) <= Number(form.low_stock_threshold) ? (
                      <span className="badge-lowstock">Low Stock ({form.stock} left)</span>
                    ) : (
                      <span className="badge-instock">In Stock ({form.stock} available)</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: IMAGES */}
            {activeTab === 'images' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* File Upload Box & URL Input */}
                <div style={{ background: '#FAFAF8', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-hover)' }}>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Upload Product Images
                  </label>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                    <label
                      style={{
                        padding: '10px 18px',
                        background: 'var(--dusty-rose)',
                        color: '#FFF',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Upload size={16} />
                      <span>{isUploading ? 'Uploading...' : '📁 Upload Image File(s) from Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={isUploading}
                        onChange={handleModalFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>or paste image URL below</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <input
                      type="text"
                      id="newImageUrl"
                      placeholder="https://images.unsplash.com/... or paste image URL"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newImageUrl');
                        if (input && input.value) {
                          handleAddImageUrl(input.value);
                          input.value = '';
                        }
                      }}
                      className="btn-secondary"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Add URL Photo
                    </button>
                  </div>
                </div>

                {/* Thumbnail Gallery & Primary Selection */}
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '10px' }}>
                    Product Images ({form.images.length})
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px' }}>
                    {form.images.map((imgUrl, idx) => {
                      const isPrimary = form.image === imgUrl;
                      return (
                        <div
                          key={idx}
                          style={{
                            borderRadius: 'var(--radius-sm)',
                            border: isPrimary ? '2px solid var(--dusty-rose)' : '1px solid var(--border-light)',
                            overflow: 'hidden',
                            position: 'relative',
                            background: 'var(--bg-blush-soft)',
                            aspectRatio: '1/1'
                          }}
                        >
                          <img src={imgUrl} alt={`Product ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          
                          {isPrimary && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '6px',
                                left: '6px',
                                background: 'var(--dusty-rose)',
                                color: '#FFF',
                                fontSize: '0.62rem',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '3px'
                              }}
                            >
                              PRIMARY
                            </span>
                          )}

                          <div
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'rgba(0,0,0,0.6)',
                              padding: '4px',
                              display: 'flex',
                              justifyContent: 'space-around'
                            }}
                          >
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(imgUrl)}
                                style={{ background: 'transparent', color: '#FFF', fontSize: '0.68rem' }}
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              style={{ background: 'transparent', color: '#FF7D7D', padding: '2px' }}
                              title="Delete image"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SEO */}
            {activeTab === 'seo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    placeholder="Luxe French Baroque Pearl Earrings | LURELLE"
                    value={form.seo_title}
                    onChange={(e) => handleChange('seo_title', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="luxe-french-baroque-pearl-earrings"
                    value={form.url_slug}
                    onChange={(e) => handleChange('url_slug', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Search engine summary preview (150-160 characters)..."
                    value={form.meta_description}
                    onChange={(e) => handleChange('meta_description', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 5: MORE OPTIONS */}
            {activeTab === 'more' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Colour Tone
                    </label>
                    <input
                      type="text"
                      placeholder="Rose Gold / Pearl White / Blush Pink"
                      value={form.colour}
                      onChange={(e) => handleChange('colour', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Collection Line
                    </label>
                    <input
                      type="text"
                      placeholder="Petal Whisper 2025 / Royal Heritage"
                      value={form.collection}
                      onChange={(e) => handleChange('collection', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Weight
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 14g"
                      value={form.weight}
                      onChange={(e) => handleChange('weight', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Size / Dimensions
                    </label>
                    <input
                      type="text"
                      placeholder="Adjustable / 5.5 cm length"
                      value={form.size}
                      onChange={(e) => handleChange('size', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Materials & Finish
                  </label>
                  <input
                    type="text"
                    placeholder="Anti-Tarnish Rose Gold Plating, Cubic Zirconia, Baroque Pearl"
                    value={form.material}
                    onChange={(e) => handleChange('material', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Earrings, Bestseller, Party Wear"
                    value={form.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                  />
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '28px', paddingTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => handleChange('is_featured', e.target.checked)}
                      style={{ width: 'auto' }}
                    />
                    <span>Featured in Highlights</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                      style={{ width: 'auto' }}
                    />
                    <span>Active on WhatsApp Catalogue</span>
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: '18px 28px',
              borderTop: '1px solid var(--border-light)',
              background: '#FCFBFB',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
