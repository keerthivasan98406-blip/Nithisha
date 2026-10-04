import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingBag,
  Percent,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AnalyticsPage() {
  const { products, orders, showToast } = useAdmin();
  const [period, setPeriod] = useState('Monthly'); // 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'

  const totalRev = orders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + o.total, 0) * 14;
  const totalCost = Math.round(totalRev * 0.42);
  const grossProfit = totalRev - totalCost;
  const profitMargin = ((grossProfit / totalRev) * 100).toFixed(1);

  const kpis = [
    { title: 'Total Revenue', value: `₹${totalRev.toLocaleString('en-IN')}`, trend: '+28.4%', isUp: true, sub: 'vs last cycle' },
    { title: 'Total Orders', value: (orders.length * 12).toString(), trend: '+14.2%', isUp: true, sub: 'fulfilled orders' },
    { title: 'Average Order Value', value: '₹1,480', trend: '+8.6%', isUp: true, sub: 'basket average' },
    { title: 'Conversion Rate', value: '4.8%', trend: '+1.2%', isUp: true, sub: 'catalogue inquiries' }
  ];

  const handleExport = () => {
    showToast('Analytics summary report generated & downloaded.', 'success');
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
            Store Performance & Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
            Comprehensive gross margins, customer acquisition, and departmental performance metrics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Period Selector */}
          <div
            style={{
              display: 'flex',
              background: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '3px',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '5px',
                  fontSize: '0.80rem',
                  fontWeight: period === p ? 600 : 500,
                  background: period === p ? 'var(--bg-blush-subtle)' : 'transparent',
                  color: period === p ? 'var(--burgundy-deep)' : 'var(--text-secondary)',
                  border: period === p ? '1px solid var(--border-hover)' : '1px solid transparent'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '28px'
        }}
      >
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '22px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
              {kpi.title}
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px', letterSpacing: '-0.02em' }}>
              {kpi.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem' }}>
              <span style={{ color: kpi.isUp ? '#237A4B' : '#B8323E', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                {kpi.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.trend}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* PROFIT OVERVIEW FINANCIAL CARD */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF8F9 100%)',
          borderRadius: 'var(--radius-md)',
          padding: '26px 30px',
          border: '1px solid var(--border-hover)',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--burgundy-deep)' }}>
              Profit & Margins Overview ({period})
            </h3>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Internal owner ledger comparing sales revenue against procurement costs
            </p>
          </div>
          <span
            style={{
              background: '#EBF8F0',
              color: '#237A4B',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.76rem',
              fontWeight: 700,
              border: '1px solid #C8EEDB'
            }}
          >
            Healthy Gross Margin: {profitMargin}%
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
          <div style={{ padding: '16px', background: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</span>
            <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
              ₹{totalRev.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ padding: '16px', background: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Cost of Goods (COGS)</span>
            <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '4px' }}>
              ₹{totalCost.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ padding: '16px', background: '#F0F9F3', borderRadius: 'var(--radius-sm)', border: '1px solid #D2EEDD' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#237A4B', fontWeight: 600 }}>Gross Profit</span>
            <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#1B6A38', marginTop: '4px' }}>
              ₹{grossProfit.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-blush-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hover)' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--burgundy-deep)', fontWeight: 600 }}>Profit Margin</span>
            <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--burgundy-deep)', marginTop: '4px' }}>
              {profitMargin}%
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS GRID: Revenue Overview & Sales by Category */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.45fr 1fr',
          gap: '22px',
          marginBottom: '28px'
        }}
        className="charts-row"
      >
        {/* Revenue Overview Curve */}
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>
              Revenue & Orders Growth
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--dusty-rose)', fontWeight: 600 }}>
              ● Revenue  ○ Projected
            </span>
          </div>

          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#541424" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#541424" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="50" x2="500" y2="50" stroke="#F6ECEE" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F6ECEE" strokeDasharray="3 3" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#F6ECEE" strokeDasharray="3 3" />

              <path
                d="M 10 160 Q 90 120, 160 130 T 300 70 T 420 50 T 490 30 L 490 190 L 10 190 Z"
                fill="url(#analyticsGrad)"
              />
              <path
                d="M 10 160 Q 90 120, 160 130 T 300 70 T 420 50 T 490 30"
                fill="none"
                stroke="var(--burgundy-deep)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />

              {[[10, 160], [160, 130], [300, 70], [420, 50], [490, 30]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5" fill="#FFFFFF" stroke="var(--burgundy-deep)" strokeWidth="2.5" />
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Current</span>
            </div>
          </div>
        </div>

        {/* Sales by Category Breakdown */}
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600, marginBottom: '16px' }}>
            Department Sales Share
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { name: 'Earrings', pct: 34, val: '₹42,350', color: '#C57D8A' },
              { name: 'Necklaces & Pendants', pct: 30, val: '₹37,368', color: '#541424' },
              { name: 'Bracelets & Bangles', pct: 18, val: '₹22,420', color: '#C5A059' },
              { name: 'Rings', pct: 12, val: '₹14,947', color: '#EBBAC4' },
              { name: 'Bridal Sets', pct: 6, val: '₹7,473', color: '#3F0D1A' }
            ].map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{cat.name}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{cat.val} ({cat.pct}%)</span>
                </div>
                <div style={{ width: '100%', height: '7px', background: '#F4ECEE', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.pct}%`, height: '100%', background: cat.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
