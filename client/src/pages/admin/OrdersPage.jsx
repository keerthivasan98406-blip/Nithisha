import React, { useState } from 'react';
import {
  Search,
  Download,
  Filter,
  Eye,
  MessageCircle,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';

export default function OrdersPage() {
  const { orders, updateOrderStatus, showToast } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status counts for Top KPI cards
  const totalCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const processingCount = orders.filter(o => o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  const kpis = [
    { label: 'Total Orders', count: totalCount, color: 'var(--burgundy-deep)', filterKey: 'all' },
    { label: 'Pending', count: pendingCount, color: '#B46410', filterKey: 'Pending' },
    { label: 'Processing', count: processingCount, color: 'var(--dusty-rose)', filterKey: 'Processing' },
    { label: 'Shipped', count: shippedCount, color: '#1F6EB8', filterKey: 'Shipped' },
    { label: 'Delivered', count: deliveredCount, color: '#237A4B', filterKey: 'Delivered' },
    { label: 'Cancelled', count: cancelledCount, color: '#B8323E', filterKey: 'Cancelled' }
  ];

  // Filtering
  const filteredOrders = orders.filter(order => {
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = !term ||
      order.id.toLowerCase().includes(term) ||
      order.customer_name.toLowerCase().includes(term) ||
      order.customer_phone.includes(term);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    showToast('Exporting orders CSV statement...', 'success');
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
            Orders Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
            Track, process and manage customer orders placed via WhatsApp concierge.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="btn-secondary"
          style={{ padding: '9px 18px', fontSize: '0.84rem' }}
        >
          <Download size={15} />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* TOP KPI CARDS (Total, Pending, Processing, Shipped, Delivered, Cancelled) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}
      >
        {kpis.map((kpi, idx) => {
          const isSelected = statusFilter === kpi.filterKey;
          return (
            <div
              key={idx}
              onClick={() => setStatusFilter(kpi.filterKey)}
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '16px 18px',
                border: isSelected ? `2px solid ${kpi.color}` : '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-xs)',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              className="kpi-card-hover"
            >
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 600 }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: '1.7rem', fontWeight: 700, color: kpi.color, marginTop: '4px' }}>
                {kpi.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* CONTROLS BAR: Search, Status filter, Payment filter */}
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
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Order ID, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', height: '38px', fontSize: '0.86rem' }}
          />
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto', height: '38px', fontSize: '0.84rem', padding: '6px 12px' }}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.80rem', color: 'var(--text-muted)' }}>Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              style={{ width: 'auto', height: '38px', fontSize: '0.84rem', padding: '6px 12px' }}
            >
              <option value="all">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="COD">COD</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

        </div>
      </div>

      {/* ORDERS TABLE */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-card)',
          overflowX: 'auto'
        }}
      >
        {filteredOrders.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders match the current filter selection.
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
                <th style={{ padding: '14px 18px' }}>Order ID</th>
                <th style={{ padding: '14px 18px' }}>Customer</th>
                <th style={{ padding: '14px 18px' }}>Date</th>
                <th style={{ padding: '14px 18px' }}>Items</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Total Amount</th>
                <th style={{ padding: '14px 18px' }}>Payment</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const statusStyles = {
                  Pending: { bg: '#FFF6EA', text: '#B46410' },
                  Processing: { bg: '#FDF4F6', text: '#541424' },
                  Shipped: { bg: '#EDF5FD', text: '#1F6EB8' },
                  Delivered: { bg: '#EBF8F0', text: '#237A4B' },
                  Cancelled: { bg: '#FDF0F0', text: '#B8323E' }
                };
                const s = statusStyles[order.status] || { bg: '#F5F5F5', text: '#666' };

                const paymentStyles = {
                  Paid: { color: '#237A4B' },
                  Pending: { color: '#B46410' },
                  COD: { color: 'var(--text-secondary)' },
                  Refunded: { color: '#B8323E' }
                };
                const p = paymentStyles[order.payment_status] || { color: 'var(--text-secondary)' };

                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}
                    className="table-row-hover"
                    onClick={() => handleOpenOrder(order)}
                  >
                    <td style={{ padding: '13px 18px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--dusty-rose)' }}>
                      {order.id}
                    </td>

                    <td style={{ padding: '13px 18px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{order.customer_phone}</div>
                    </td>

                    <td style={{ padding: '13px 18px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {order.date}
                    </td>

                    <td style={{ padding: '13px 18px', color: 'var(--text-secondary)' }}>
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </td>

                    <td style={{ padding: '13px 18px', textAlign: 'right', fontWeight: 700, color: 'var(--burgundy-deep)' }}>
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>

                    <td style={{ padding: '13px 18px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.78rem', color: p.color }}>
                        {order.payment_status}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                        {order.payment_method}
                      </span>
                    </td>

                    <td style={{ padding: '13px 18px' }}>
                      <span
                        style={{
                          background: s.bg,
                          color: s.text,
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.74rem',
                          fontWeight: 600
                        }}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td style={{ padding: '13px 18px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenOrder(order)}
                          className="btn-secondary"
                          style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />

    </div>
  );
}
