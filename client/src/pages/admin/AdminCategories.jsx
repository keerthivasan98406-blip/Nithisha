import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Grid } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image_url: '',
    description: '',
    sort_order: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      description: '',
      sort_order: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setModalMode('edit');
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image_url: cat.image_url,
      description: cat.description || '',
      sort_order: cat.sort_order || 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        fetchCategories();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (err) {
      alert('Error deleting category');
    }
  };

  // Image Upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    setUploadingImage(true);

    try {
      const res = await fetch('/api/upload/single', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      if (res.ok) {
        const uploadRes = await res.json();
        setFormData(prev => ({ ...prev, image_url: uploadRes.url }));
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = modalMode === 'add' ? '/api/categories' : `/api/categories/${editingId}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to save category');
      }
    } catch (err) {
      alert('Error saving category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 600 }}>
            Category Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px' }}>
            Organize fashion jewellery lines, category cover photography, and live product counts.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.86rem' }}>
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading jewellery categories...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
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
              <div style={{ height: '180px', position: 'relative', background: 'var(--bg-blush-soft)' }}>
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(6px)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}
                >
                  Order: #{cat.sort_order}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>
                      {cat.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-rosegold-dark)', fontWeight: 600 }}>
                      {cat.available_count ?? 0} in stock
                    </span>
                  </div>

                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '8px' }}>
                    slug: /{cat.slug}
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {cat.description || 'No description provided.'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    style={{ background: '#FDF2F2', color: '#C96B6B', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
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
              maxWidth: '520px',
              padding: '24px',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600 }}>
                {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', padding: '4px' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Earrings"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="earrings (leave blank to autogenerate)"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 500 }}>
                      Category Image URL *
                    </label>
                    <label
                      style={{
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        color: 'var(--accent-rosegold-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Upload size={14} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description displayed on category cards..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
