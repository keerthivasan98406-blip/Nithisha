import React, { useState } from 'react';
import {
  Users,
  Search,
  UserCheck,
  UserPlus,
  Award,
  Phone,
  Mail,
  Eye,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import CustomerDrawer from '../../components/admin/CustomerDrawer';

export default function CustomersPage() {
  const { customers } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Customer Drawer Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Statistics
  const totalCount = customers.length;
  const newCount = customers.filter(c => c.status === 'New').length;
  const vipCount = customers.filter(c => c.status === 'VIP').length;
  const activeCount = customers.filter(c => c.status === 'Active').length;

  const stats = [
    { label: 'Total Customers', count: totalCount, icon: Users, sub: 'Registered contacts' },
    { label: 'New Customers', count: newCount, icon: UserPlus, sub: 'Added this month' },
    { label: 'Returning Customers', count: activeCount + vipCount, icon: UserCheck, sub: 'Multiple boutique orders' },
    { label: 'Top VIP Clients', count: vipCount, icon: Award, sub: 'Highest spenders' }
  ];

  // Filtered
  const filteredCustomers = customers.filter(cust => {
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = !term ||
      cust.name.toLowerCase().includes(term) ||
      cust.phone.includes(term) ||
      cust.email.toLowerCase().includes(term) ||
      cust.city.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || cust.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenCustomer = (cust) => {
    setSelectedCustomer(cust);
    setIsDrawerOpen(true);
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
            Customer Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
            Directory of clientele, VIP order histories, and contact preferences.
          </p>
        </div>
      </div>

      {/* DASHBOARD STATISTICS CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '28px'
        }}
      >
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'var(--bg-blush-soft)',
                  color: 'var(--burgundy-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {st.label}
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px', lineHeight: 1.1 }}>
                  {st.count}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {st.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONTROLS: Search & Status Filter */}
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
        {/* Search */}
        <div style={{ position: 'relative', width: '340px', maxWidth: '100%' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search customer name, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.86rem' }}
          />
        </div>

        {/* Status Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', height: '38px', fontSize: '0.84rem', padding: '6px 12px' }}
          >
            <option value="all">All Tiers</option>
            <option value="VIP">VIP Spenders</option>
            <option value="Active">Active Customers</option>
            <option value="New">New Registrations</option>
          </select>
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-card)',
          overflowX: 'auto'
        }}
      >
        {filteredCustomers.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No customers match the current filter.
          </div>
        ) : (
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
                <th style={{ padding: '14px 18px' }}>Customer</th>
                <th style={{ padding: '14px 18px' }}>Contact Phone</th>
                <th style={{ padding: '14px 18px' }}>Email</th>
                <th style={{ padding: '14px 18px', textAlign: 'center' }}>Orders</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Total Spent</th>
                <th style={{ padding: '14px 18px' }}>Last Order</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(cust => (
                <tr
                  key={cust.id}
                  style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}
                  className="table-row-hover"
                  onClick={() => handleOpenCustomer(cust)}
                >
                  <td style={{ padding: '13px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'var(--bg-blush-soft)',
                        color: 'var(--burgundy-deep)',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      {cust.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cust.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{cust.city}, {cust.state}</div>
                    </div>
                  </td>

                  <td style={{ padding: '13px 18px', color: 'var(--text-secondary)' }}>
                    {cust.phone}
                  </td>

                  <td style={{ padding: '13px 18px', color: 'var(--text-secondary)' }}>
                    {cust.email}
                  </td>

                  <td style={{ padding: '13px 18px', textAlign: 'center', fontWeight: 600 }}>
                    {cust.total_orders}
                  </td>

                  <td style={{ padding: '13px 18px', textAlign: 'right', fontWeight: 700, color: 'var(--burgundy-deep)' }}>
                    ₹{cust.total_spent.toLocaleString('en-IN')}
                  </td>

                  <td style={{ padding: '13px 18px', color: 'var(--text-muted)', fontSize: '0.80rem' }}>
                    {cust.last_order_date}
                  </td>

                  <td style={{ padding: '13px 18px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        background: cust.status === 'VIP' ? '#FAF0E6' : cust.status === 'Active' ? '#EBF8F0' : '#F4F4F6',
                        color: cust.status === 'VIP' ? '#A2682A' : cust.status === 'Active' ? '#237A4B' : 'var(--text-secondary)'
                      }}
                    >
                      {cust.status}
                    </span>
                  </td>

                  <td style={{ padding: '13px 18px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenCustomer(cust)}
                      className="btn-secondary"
                      style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CUSTOMER PROFILE DRAWER */}
      <CustomerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        customer={selectedCustomer}
      />

    </div>
  );
}
