import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Sparkles,
  Calendar,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function DashboardPage() {
  const { products, orders, customers, setActiveTab } = useAdmin();
  const [dateRange, setDateRange] = useState('This Month');

  // KPI calculations based on selected dateRange
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const kpis = [
    {
      title: 'TOTAL PRODUCTS',
      value: products.length.toString(),
      trend: '+12%',
      isPositive: true,
      subtext: 'vs last month',
      icon: Package,
      linkTab: 'products'
    },
    {
      title: 'TOTAL ORDERS',
      value: orders.length.toString(),
      trend: '+18.4%',
      isPositive: true,
      subtext: 'vs last period',
      icon: ShoppingBag,
      linkTab: 'orders'
    },
    {
      title: 'TOTAL REVENUE',
      value: `₹${(totalRevenue * 14).toLocaleString('en-IN')}`,
      trend: '+24.8%',
      isPositive: true,
      subtext: 'vs previous cycle',
      icon: TrendingUp,
      linkTab: 'analytics'
    },
    {
      title: 'NEW CUSTOMERS',
      value: customers.length.toString(),
      trend: '+15.2%',
      isPositive: true,
      subtext: 'from WhatsApp orders',
      icon: Users,
      linkTab: 'customers'
    }
  ];

  // Category Donut Data
  const categories = [
    { name: 'Earrings', percentage: 34, color: '#C57D8A', count: 18 },
    { name: 'Necklaces', percentage: 22, color: '#541424', count: 12 },
    { name: 'Bracelets', percentage: 16, color: '#C5A059', count: 9 },
    { name: 'Rings', percentage: 14, color: '#EBBAC4', count: 8 },
    { name: 'Pendants', percentage: 8, color: '#8E8287', count: 5 },
    { name: 'Sets', percentage: 6, color: '#3F0D1A', count: 4 }
  ];

  // Top Selling Products data
  const topSelling = [
    {
      product: 'Luxe French Baroque Pearl Earrings',
      category: 'Earrings',
      units_sold: 48,
      revenue: '₹23,952',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=120&q=80'
    },
    {
      product: 'Dainty Rose Quartz Solitaire Pendant',
      category: 'Necklaces',
      units_sold: 34,
      revenue: '₹23,766',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=120&q=80'
    },
    {
      product: 'Aurora Tennis Slider Charm Bracelet',
      category: 'Bracelets',
      units_sold: 29,
      revenue: '₹17,371',
      image: 'https://images.unsplash.com/photo-1611591475819-79b8b738982a?auto=format&fit=crop&w=120&q=80'
    },
    {
      product: 'Seraphina Royal Festive Choker Suite',
      category: 'Sets',
      units_sold: 21,
      revenue: '₹31,479',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=120&q=80'
    }
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Editorial Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Welcome Back, Nithisha! ✨
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
            Here’s what’s happening with your jewellery store today.
          </p>
        </div>

        {/* Date Range Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          {['Today', 'This Week', 'This Month', 'This Year'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.80rem',
                fontWeight: dateRange === range ? 600 : 500,
                background: dateRange === range ? 'var(--bg-blush-subtle)' : 'transparent',
                color: dateRange === range ? 'var(--burgundy-deep)' : 'var(--text-secondary)',
                border: dateRange === range ? '1px solid var(--border-hover)' : '1px solid transparent'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS (4 Columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => setActiveTab(kpi.linkTab)}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '22px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              className="kpi-card-hover"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {kpi.title}
                </span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--bg-blush-soft)',
                    color: 'var(--burgundy-deep)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: '2.1rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {kpi.value}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.78rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      color: kpi.isPositive ? '#237A4B' : '#B8323E',
                      fontWeight: 600
                    }}
                  >
                    {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {kpi.trend}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{kpi.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHARTS ROW: SALES OVERVIEW & CATEGORY PERFORMANCE */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: '22px',
          marginBottom: '32px'
        }}
        className="charts-row"
      >
        
        {/* Sales Overview Line/Area Chart */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
                Sales Overview
              </h3>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Daily boutique revenue trend from WhatsApp orders
              </p>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--burgundy-deep)', background: 'var(--bg-blush-subtle)', padding: '4px 10px', borderRadius: '4px' }}>
              Avg. Order: ₹1,480
            </div>
          </div>

          {/* SVG Area / Line Chart Curve */}
          <div style={{ position: 'relative', width: '100%', height: '220px', marginTop: '10px' }}>
            <svg viewBox="0 0 600 220" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C57D8A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#C57D8A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#F4ECEE" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#F4ECEE" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#F4ECEE" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="600" y2="190" stroke="#F4ECEE" strokeDasharray="4 4" />

              {/* Filled Area */}
              <path
                d="M 20 170 Q 80 130, 140 145 T 260 90 T 380 110 T 500 50 T 580 40 L 580 200 L 20 200 Z"
                fill="url(#areaGradient)"
              />

              {/* Trend Curve Line */}
              <path
                d="M 20 170 Q 80 130, 140 145 T 260 90 T 380 110 T 500 50 T 580 40"
                fill="none"
                stroke="var(--burgundy-deep)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Accent Points */}
              {[[20, 170], [140, 145], [260, 90], [380, 110], [500, 50], [580, 40]].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="6" fill="#FFFFFF" stroke="var(--burgundy-deep)" strokeWidth="2.5" />
                  <circle cx={cx} cy={cy} r="2.5" fill="var(--dusty-rose)" />
                </g>
              ))}
            </svg>

            {/* X-axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              <span>May 01</span>
              <span>May 05</span>
              <span>May 10</span>
              <span>May 15</span>
              <span>May 20</span>
              <span>May 25</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Category Performance Donut Chart */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
              Category Performance
            </h3>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Revenue share by jewellery department
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '16px 0' }}>
            {/* SVG Donut */}
            <div style={{ position: 'relative', width: '130px', height: '130px' }}>
              <svg viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                {/* Donut Segments */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#EFE6E8" strokeWidth="6" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#C57D8A" strokeWidth="6" strokeDasharray="34 66" strokeDashoffset="0" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#541424" strokeWidth="6" strokeDasharray="22 78" strokeDashoffset="-34" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#C5A059" strokeWidth="6" strokeDasharray="16 84" strokeDashoffset="-56" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#EBBAC4" strokeWidth="6" strokeDasharray="14 86" strokeDashoffset="-72" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8E8287" strokeWidth="6" strokeDasharray="8 92" strokeDashoffset="-86" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3F0D1A" strokeWidth="6" strokeDasharray="6 94" strokeDashoffset="-94" />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1
                }}
              >
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--burgundy-deep)' }}>100%</span>
                <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: '2px' }}>Total Sales</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.80rem' }}>
              {categories.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-main)', minWidth: '70px', fontWeight: 500 }}>{c.name}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{c.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('products')}
            style={{
              background: 'transparent',
              fontSize: '0.78rem',
              color: 'var(--dusty-rose)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '12px'
            }}
          >
            <span>Manage All Collections</span>
            <ChevronRight size={14} />
          </button>
        </div>

      </div>

      {/* RECENT PRODUCTS PREVIEW (Horizontal Jewellery Carousel) */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
              Recent Products in Catalogue
            </h3>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)', marginTop: '1px' }}>
              Recently curated pieces with instant stock visibility
            </p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.80rem' }}
          >
            View All ({products.length})
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}
        >
          {products.slice(0, 5).map(prod => (
            <div
              key={prod.id}
              onClick={() => setActiveTab('products')}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="kpi-card-hover"
            >
              <div style={{ height: '140px', position: 'relative', background: 'var(--bg-blush-soft)' }}>
                <img
                  src={prod.image}
                  alt={prod.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '0.70rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: prod.stock_status === 'in_stock' ? '#EBF8F0' : prod.stock_status === 'low_stock' ? '#FFF6EA' : '#FDF0F0',
                    color: prod.stock_status === 'in_stock' ? '#237A4B' : prod.stock_status === 'low_stock' ? '#B46410' : '#B8323E'
                  }}
                >
                  {prod.stock} in stock
                </span>
              </div>
              <div style={{ padding: '12px' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--dusty-rose)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {prod.sku}
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.96rem',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    margin: '3px 0 6px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={prod.name}
                >
                  {prod.name}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    ₹{prod.selling_price.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#237A4B', fontWeight: 600 }}>
                    +{prod.profit_margin}% Margin
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOWER SECTION: TOP SELLING PRODUCTS & RECENT ORDERS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 1.35fr',
          gap: '22px'
        }}
        className="charts-row"
      >
        
        {/* Top Selling Products Table */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
                Top Selling Products
              </h3>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
                Highest volume pieces this cycle
              </p>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              style={{ background: 'transparent', color: 'var(--dusty-rose)', fontSize: '0.80rem', fontWeight: 500 }}
            >
              Catalogue →
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '8px 6px' }}>Product</th>
                  <th style={{ padding: '8px 6px' }}>Category</th>
                  <th style={{ padding: '8px 6px', textAlign: 'center' }}>Units</th>
                  <th style={{ padding: '8px 6px', textAlign: 'right' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSelling.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={item.image} alt={item.product} style={{ width: '34px', height: '34px', borderRadius: '4px', objectFit: 'cover' }} />
                      <span style={{ fontWeight: 500, color: 'var(--text-main)', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.product}
                      </span>
                    </td>
                    <td style={{ padding: '10px 6px', color: 'var(--text-secondary)' }}>{item.category}</td>
                    <td style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 600 }}>{item.units_sold}</td>
                    <td style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 600, color: 'var(--burgundy-deep)' }}>{item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600 }}>
                Recent Orders
              </h3>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>
                Latest WhatsApp concierge inquiries and fulfilled requests
              </p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              style={{ background: 'transparent', color: 'var(--dusty-rose)', fontSize: '0.80rem', fontWeight: 500 }}
            >
              All Orders →
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '8px 6px' }}>Order ID</th>
                  <th style={{ padding: '8px 6px' }}>Customer</th>
                  <th style={{ padding: '8px 6px' }}>Date</th>
                  <th style={{ padding: '8px 6px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '8px 6px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => {
                  const statusColors = {
                    Pending: { bg: '#FFF6EA', text: '#B46410' },
                    Processing: { bg: '#FDF4F6', text: '#541424' },
                    Shipped: { bg: '#EDF5FD', text: '#1F6EB8' },
                    Delivered: { bg: '#EBF8F0', text: '#237A4B' },
                    Cancelled: { bg: '#FDF0F0', text: '#B8323E' }
                  };
                  const color = statusColors[order.status] || { bg: '#F5F5F5', text: '#666' };

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setActiveTab('orders')}
                      style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '11px 6px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--dusty-rose)' }}>
                        {order.id}
                      </td>
                      <td style={{ padding: '11px 6px', fontWeight: 500, color: 'var(--text-main)' }}>
                        {order.customer_name}
                      </td>
                      <td style={{ padding: '11px 6px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {order.date.split(' ')[0]}
                      </td>
                      <td style={{ padding: '11px 6px', textAlign: 'right', fontWeight: 600 }}>
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '11px 6px' }}>
                        <span
                          style={{
                            background: color.bg,
                            color: color.text,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 600
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <style>{`
        .kpi-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-hover) !important;
          border-color: var(--border-hover) !important;
        }
        .table-row-hover:hover {
          background-color: var(--bg-blush-subtle);
        }
        @media (max-width: 990px) {
          .charts-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
