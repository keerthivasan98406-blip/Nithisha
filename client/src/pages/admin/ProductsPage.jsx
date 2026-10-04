import React, { useState } from 'react';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Edit2,
  Copy,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpDown,
  MoreVertical
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import ProductModal from '../../components/admin/ProductModal';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

export default function ProductsPage() {
  const { products, deleteProduct, duplicateProduct } = useAdmin();

  const [activeCategoryTab, setActiveCategoryTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Category Tabs
  const categoryTabs = ['All', 'Earrings', 'Necklaces', 'Bracelets', 'Rings', 'Pendants', 'Sets'];

  // Filtering & Sorting
  const filteredProducts = products.filter(p => {
    // Category match
    const matchesCategory = activeCategoryTab === 'All' || p.category.toLowerCase() === activeCategoryTab.toLowerCase();
    
    // Search match
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = !term || p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term);

    // Stock match
    const matchesStock = stockFilter === 'all' || p.stock_status === stockFilter;

    return matchesCategory && matchesSearch && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.selling_price - b.selling_price;
    if (sortBy === 'price_desc') return b.selling_price - a.selling_price;
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
    if (sortBy === 'profit_desc') return b.profit - a.profit;
    if (sortBy === 'stock_desc') return b.stock - a.stock;
    return b.id - a.id;
  });

  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (product) => {
    setProductToEdit(product);
    setIsEditorOpen(true);
  };

  const handlePromptDelete = (product) => {
    setItemToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteProduct(itemToDelete.id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
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
            Product Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
            Manage your jewellery collection, pricing, stock and product information.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary"
          style={{ padding: '10px 22px' }}
        >
          <Plus size={16} />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* CATEGORY TABS (All, Earrings, Necklaces, Bracelets, Rings, Pendants, Sets) */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '14px',
          marginBottom: '22px',
          overflowX: 'auto'
        }}
      >
        {categoryTabs.map(tab => {
          const isActive = activeCategoryTab === tab;
          const count = tab === 'All' 
            ? products.length 
            : products.filter(p => p.category.toLowerCase() === tab.toLowerCase()).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveCategoryTab(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'var(--burgundy-deep)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--burgundy-deep)' : '1px solid var(--border-light)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isActive ? '0 2px 8px var(--burgundy-glow)' : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  opacity: 0.85,
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

      {/* TOP CONTROLS: Search, Stock status, Sorting, View Mode Toggle */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          border: '1px solid var(--border-light)',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        {/* Left: Search Bar */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.86rem' }}
          />
        </div>

        {/* Right Controls: Filters, Sort, View Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Stock status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              style={{ width: 'auto', height: '38px', fontSize: '0.84rem', padding: '6px 12px' }}
            >
              <option value="all">All Inventory</option>
              <option value="in_stock">In Stock (&gt;8)</option>
              <option value="low_stock">Low Stock (≤8)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: 'auto', height: '38px', fontSize: '0.84rem', padding: '6px 12px' }}
            >
              <option value="newest">Newest Added</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="profit_desc">Highest Profit</option>
              <option value="stock_desc">Highest Stock</option>
            </select>
          </div>

          {/* View Mode Toggle (Grid vs Table) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-blush-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 10px',
                borderRadius: '4px',
                background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'grid' ? 'var(--burgundy-deep)' : 'var(--text-muted)',
                boxShadow: viewMode === 'grid' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.80rem',
                fontWeight: viewMode === 'grid' ? 600 : 500
              }}
              title="Grid View"
            >
              <LayoutGrid size={15} />
              <span>Grid</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 10px',
                borderRadius: '4px',
                background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'table' ? 'var(--burgundy-deep)' : 'var(--text-muted)',
                boxShadow: viewMode === 'table' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.80rem',
                fontWeight: viewMode === 'table' ? 600 : 500
              }}
              title="Table View"
            >
              <List size={15} />
              <span>Table</span>
            </button>
          </div>

        </div>
      </div>

      {/* PRODUCTS DISPLAY */}
      {filteredProducts.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            padding: '70px 20px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--bg-blush-soft)',
              color: 'var(--dusty-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}
          >
            <Search size={28} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '6px' }}>
            No Jewellery Pieces Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
            Try adjusting your search criteria, category tab, or stock filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategoryTab('All'); setStockFilter('all'); }}
            className="btn-secondary"
            style={{ fontSize: '0.84rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* GRID VIEW: Luxury Product Cards */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '24px'
          }}
        >
          {filteredProducts.map(product => {
            const isOutOfStock = product.stock_status === 'out_of_stock';
            const isLowStock = product.stock_status === 'low_stock';

            return (
              <div
                key={product.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.22s ease'
                }}
                className="kpi-card-hover"
              >
                {/* Image Container with Badges */}
                <div style={{ position: 'relative', height: '230px', background: 'var(--bg-blush-soft)' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Stock Status Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 9px',
                      borderRadius: 'var(--radius-full)',
                      background: isOutOfStock ? '#FDF0F0' : isLowStock ? '#FFF6EA' : '#EBF8F0',
                      color: isOutOfStock ? '#B8323E' : isLowStock ? '#B46410' : '#237A4B',
                      border: `1px solid ${isOutOfStock ? '#F9D0D4' : isLowStock ? '#FCE0BC' : '#C8EEDB'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: isOutOfStock ? '#B8323E' : isLowStock ? '#B46410' : '#237A4B'
                      }}
                    />
                    {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low Stock (${product.stock})` : `In Stock (${product.stock})`}
                  </span>

                  {/* Category Pill */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(6px)',
                      color: 'var(--burgundy-deep)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {product.category}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: 'var(--dusty-rose)', fontWeight: 600, marginBottom: '3px' }}>
                      SKU: {product.sku}
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.18rem',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: 'var(--text-main)',
                        marginBottom: '12px'
                      }}
                    >
                      {product.name}
                    </h3>

                    {/* Financial Matrix (Selling, Cost, Profit, Margin) */}
                    <div
                      style={{
                        background: 'var(--bg-blush-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px 14px',
                        marginBottom: '16px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '10px 14px',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>SELLING PRICE</span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                          ₹{product.selling_price.toLocaleString('en-IN')}
                        </strong>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>COST PRICE</span>
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          ₹{product.cost_price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>PROFIT</span>
                        <span style={{ color: '#237A4B', fontWeight: 700 }}>
                          +₹{product.profit.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>MARGIN</span>
                        <span
                          style={{
                            background: '#EEF8F1',
                            color: '#237A4B',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            fontSize: '0.74rem',
                            fontWeight: 700
                          }}
                        >
                          {product.profit_margin}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '12px'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Units: <strong style={{ color: 'var(--text-main)' }}>{product.stock}</strong>
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        title="Edit product details"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => duplicateProduct(product.id)}
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        title="Duplicate product"
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        onClick={() => handlePromptDelete(product)}
                        style={{
                          background: '#FFF0F0',
                          color: '#B8323E',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        
        /* TABLE VIEW */
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)',
            overflowX: 'auto'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-light)',
                  background: 'var(--bg-blush-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.74rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                <th style={{ padding: '14px 16px', width: '40px' }}>
                  <input type="checkbox" style={{ width: 'auto' }} />
                </th>
                <th style={{ padding: '14px 16px' }}>Product</th>
                <th style={{ padding: '14px 16px' }}>SKU</th>
                <th style={{ padding: '14px 16px' }}>Category</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Selling</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Cost</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Profit</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Stock</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const isOutOfStock = product.stock_status === 'out_of_stock';
                const isLowStock = product.stock_status === 'low_stock';

                return (
                  <tr
                    key={product.id}
                    style={{ borderBottom: '1px solid var(--border-light)' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <input type="checkbox" style={{ width: 'auto' }} />
                    </td>

                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.90rem' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {product.collection}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--dusty-rose)' }}>
                      {product.sku}
                    </td>

                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      {product.category}
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                      ₹{product.selling_price.toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>
                      ₹{product.cost_price.toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <span style={{ color: '#237A4B', fontWeight: 600 }}>
                        +₹{product.profit.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '0.70rem', color: '#237A4B', display: 'block' }}>
                        ({product.profit_margin}%)
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>
                      {product.stock}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: isOutOfStock ? '#FDF0F0' : isLowStock ? '#FFF6EA' : '#EBF8F0',
                          color: isOutOfStock ? '#B8323E' : isLowStock ? '#B46410' : '#237A4B'
                        }}
                      >
                        {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => duplicateProduct(product.id)}
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                          title="Duplicate"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={() => handlePromptDelete(product)}
                          style={{ background: '#FFF0F0', color: '#B8323E', padding: '5px 10px', borderRadius: '4px' }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PRODUCT EDITOR MODAL */}
      <ProductModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        productToEdit={productToEdit}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Jewellery Piece"
        message={`Are you sure you want to permanently delete "${itemToDelete?.name}" (${itemToDelete?.sku}) from the store catalogue? This action cannot be reversed.`}
        confirmLabel="Delete Product"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

    </div>
  );
}
