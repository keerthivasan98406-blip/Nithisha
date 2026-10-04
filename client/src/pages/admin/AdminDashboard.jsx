import React, { useState, useEffect } from 'react';
import { Package, CheckCircle2, AlertTriangle, Grid, TrendingUp, DollarSign, Calendar, Plus, RefreshCw, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard({ setActiveTab }) {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Record Sale Modal State
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({
    product_id: '',
    product_name: '',
    product_code: '',
    quantity: 1,
    unit_selling_price: '',
    unit_purchase_cost: '',
    notes: '',
    sale_date: new Date().toISOString().split('T')[0]
  });
  const [saleSubmitting, setSaleSubmitting] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/sales/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProductsList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProducts();
  }, [token]);

  // Handle product dropdown selection in Record Sale
  const handleProductSelect = (productId) => {
    const selected = productsList.find(p => p.id === Number(productId));
    if (selected) {
      setSaleForm(prev => ({
        ...prev,
        product_id: selected.id,
        product_name: selected.name,
        product_code: selected.code,
        unit_selling_price: selected.selling_price,
        unit_purchase_cost: selected.purchase_cost
      }));
    } else {
      setSaleForm(prev => ({
        ...prev,
        product_id: '',
        product_name: '',
        product_code: '',
        unit_selling_price: '',
        unit_purchase_cost: ''
      }));
    }
  };

  const handleRecordSaleSubmit = async (e) => {
    e.preventDefault();
    setSaleSubmitting(true);

    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleForm)
      });

      if (res.ok) {
        setIsRecordSaleOpen(false);
        setSaleForm({
          product_id: '',
          product_name: '',
          product_code: '',
          quantity: 1,
          unit_selling_price: '',
          unit_purchase_cost: '',
          notes: '',
          sale_date: new Date().toISOString().split('T')[0]
        });
        fetchStats();
        fetchProducts();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to record sale');
      }
    } catch (err) {
      alert('Error recording sale');
    } finally {
      setSaleSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading dashboard analytics...
      </div>
    );
  }

  const { products, today, monthly, recent_sales } = stats || {
    products: { total: 0, available: 0, sold_out: 0, categories: 0 },
    today: { sales: 0, profit: 0, items_sold: 0 },
    monthly: { sales: 0, profit: 0, items_sold: 0 },
    recent_sales: []
  };

  return (
    <div>
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 600 }}>
            Store Performance & Catalogue Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px' }}>
            Real-time stock counters and internal owner profit tracking for WhatsApp boutique orders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsRecordSaleOpen(true)}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.86rem' }}
          >
            <Plus size={16} />
            <span>Record Customer Sale</span>
          </button>
        </div>
      </div>

      {/* SECTION 17: DASHBOARD METRIC CARDS */}
      
      {/* Group 1: Product Inventory Metrics */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>
          Catalogue & Inventory Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
          
          {/* Total Products */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>TOTAL PRODUCTS</span>
              <Package size={20} color="var(--accent-rosegold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{products.total}</div>
            <button onClick={() => setActiveTab('products')} style={{ background: 'transparent', fontSize: '0.76rem', color: 'var(--accent-rosegold-dark)', marginTop: '4px', padding: 0 }}>
              Manage products →
            </button>
          </div>

          {/* Available Products */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>AVAILABLE PRODUCTS</span>
              <CheckCircle2 size={20} color="#4F8A68" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4F8A68' }}>{products.available}</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>Ready for orders</div>
          </div>

          {/* Sold Out Products */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>SOLD OUT</span>
              <AlertTriangle size={20} color="#C96B6B" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#C96B6B' }}>{products.sold_out}</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>Out of stock pieces</div>
          </div>

          {/* Total Categories */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>COLLECTION LINES</span>
              <Grid size={20} color="var(--accent-rosegold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{products.categories}</div>
            <button onClick={() => setActiveTab('products')} style={{ background: 'transparent', fontSize: '0.76rem', color: 'var(--accent-rosegold-dark)', marginTop: '4px', padding: 0 }}>
              View catalogue →
            </button>
          </div>

        </div>
      </div>

      {/* Group 2: Profit & Sales Metrics */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>
          Owner Sales & Profit Metrics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
          
          {/* Today's Sales */}
          <div style={{ background: 'var(--bg-blush-soft)', padding: '22px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-hover)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
              TODAY'S SALES
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '8px' }}>
              ₹{today.sales.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {today.items_sold} jewellery items sold today
            </div>
          </div>

          {/* Today's Profit */}
          <div style={{ background: '#EFF7F2', padding: '22px', borderRadius: 'var(--radius-md)', border: '1px solid #CCE8D8', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4F8A68', fontWeight: 600 }}>
              TODAY'S PROFIT
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#4F8A68', marginTop: '8px' }}>
              ₹{today.profit.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#4F8A68', marginTop: '4px' }}>
              Margin: {today.sales > 0 ? ((today.profit / today.sales) * 100).toFixed(1) : 0}%
            </div>
          </div>

          {/* Monthly Sales */}
          <div style={{ background: 'var(--bg-blush-soft)', padding: '22px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-hover)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
              MONTHLY SALES
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '8px' }}>
              ₹{monthly.sales.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {monthly.items_sold} pieces sold this month
            </div>
          </div>

          {/* Monthly Profit */}
          <div style={{ background: '#EFF7F2', padding: '22px', borderRadius: 'var(--radius-md)', border: '1px solid #CCE8D8', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4F8A68', fontWeight: 600 }}>
              MONTHLY PROFIT
            </span>
            <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#4F8A68', marginTop: '8px' }}>
              ₹{monthly.profit.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#4F8A68', marginTop: '4px' }}>
              Margin: {monthly.sales > 0 ? ((monthly.profit / monthly.sales) * 100).toFixed(1) : 0}%
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 22: RECENT SALES TABLE */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
              Recent Sales & Profit Log
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Owner-recorded orders with calculated costs, revenue, and gross profit.
            </p>
          </div>
          <button
            onClick={() => setIsRecordSaleOpen(true)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            + Record Sale
          </button>
        </div>

        {recent_sales.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No sales recorded yet. Click "+ Record Customer Sale" above to log sales from WhatsApp orders.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '12px 14px' }}>Date</th>
                  <th style={{ padding: '12px 14px' }}>Product</th>
                  <th style={{ padding: '12px 14px' }}>Code</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Selling Price</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Purchase Cost</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Revenue</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Profit</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Margin</th>
                </tr>
              </thead>
              <tbody>
                {recent_sales.map((sale) => {
                  const margin = sale.total_revenue > 0 ? ((sale.total_profit / sale.total_revenue) * 100).toFixed(1) : 0;
                  return (
                    <tr key={sale.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{sale.sale_date}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 500, color: 'var(--text-main)' }}>{sale.product_name}</td>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--accent-rosegold-dark)' }}>{sale.product_code}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>{sale.quantity}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>₹{sale.unit_selling_price}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--text-muted)' }}>₹{sale.unit_purchase_cost}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600 }}>₹{sale.total_revenue.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: '#4F8A68' }}>₹{sale.total_profit.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <span style={{ background: '#EFF7F2', color: '#4F8A68', padding: '3px 8px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 600 }}>
                          {margin}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: RECORD CUSTOMER SALE */}
      {isRecordSaleOpen && (
        <div className="modal-backdrop" onClick={() => setIsRecordSaleOpen(false)}>
          <div
            className="animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-modal)',
              width: '100%',
              maxWidth: '560px',
              padding: '28px',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 600 }}>
                  Record Product Sale
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Log an order finalized through WhatsApp to update sales, profit & deduct stock.
                </p>
              </div>
              <button onClick={() => setIsRecordSaleOpen(false)} style={{ background: 'transparent', padding: '4px' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordSaleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Select from catalogue */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Select Catalogue Product (Autofills details)
                  </label>
                  <select
                    value={saleForm.product_id}
                    onChange={(e) => handleProductSelect(e.target.value)}
                  >
                    <option value="">-- Choose Product or Enter Manually --</option>
                    {productsList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.code} — {p.name} (Stock: {p.stock_quantity})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={saleForm.product_name}
                      onChange={(e) => setSaleForm({ ...saleForm, product_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                      Product Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={saleForm.product_code}
                      onChange={(e) => setSaleForm({ ...saleForm, product_code: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={saleForm.quantity}
                      onChange={(e) => setSaleForm({ ...saleForm, quantity: Number(e.target.value) })}
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
                      value={saleForm.unit_selling_price}
                      onChange={(e) => setSaleForm({ ...saleForm, unit_selling_price: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                      Purchase Cost (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={saleForm.unit_purchase_cost}
                      onChange={(e) => setSaleForm({ ...saleForm, unit_purchase_cost: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Auto Calculated Live Preview */}
                {saleForm.unit_selling_price && (
                  <div style={{ background: 'var(--bg-blush-soft)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Total Revenue:</span>
                      <strong>₹{(Number(saleForm.unit_selling_price) * saleForm.quantity).toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Total Cost:</span>
                      <span>₹{(Number(saleForm.unit_purchase_cost || 0) * saleForm.quantity).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4F8A68', fontWeight: 600 }}>
                      <span>Calculated Net Profit:</span>
                      <span>₹{((Number(saleForm.unit_selling_price) - Number(saleForm.unit_purchase_cost || 0)) * saleForm.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                      Sale Date
                    </label>
                    <input
                      type="date"
                      value={saleForm.sale_date}
                      onChange={(e) => setSaleForm({ ...saleForm, sale_date: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                      Notes / Customer Reference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. WhatsApp order from Priya"
                      value={saleForm.notes}
                      onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })}
                    />
                  </div>
                </div>

              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsRecordSaleOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saleSubmitting} className="btn-primary">
                  {saleSubmitting ? 'Recording...' : 'Record Sale & Update Profit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
