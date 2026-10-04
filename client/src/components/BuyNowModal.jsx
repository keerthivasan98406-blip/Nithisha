import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, MessageCircle, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useOrderModal } from '../context/OrderModalContext';

export default function BuyNowModal() {
  const {
    isOpen,
    step,
    setStep,
    orderItems,
    updateQuantity,
    totalAmount,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    closeModal,
    validateForm,
    generateWhatsAppUrl
  } = useOrderModal();

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !orderItems || orderItems.length === 0) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'mobileNumber' && prev.sameAsMobile) {
        next.whatsappNumber = value;
      }
      return next;
    });

    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      sameAsMobile: checked,
      whatsappNumber: checked ? prev.mobileNumber : prev.whatsappNumber
    }));
  };

  const handleProceedToSummary = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleContinueToWhatsApp = () => {
    setIsSubmitting(true);
    const { waUrl } = generateWhatsAppUrl();

    // Open WhatsApp URL in new window/tab
    setTimeout(() => {
      window.open(waUrl, '_blank');
      setIsSubmitting(false);
      setStep(3); // Confirmation guidance step
    }, 400);
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-modal)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--border-light)'
        }}
      >
        {/* Modal Header */}
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
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--accent-rosegold-dark)'
              }}
            >
              WhatsApp Boutique Order
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', marginTop: '2px' }}>
              {step === 1 && 'Customer & Delivery Details'}
              {step === 2 && 'Review Order Summary'}
              {step === 3 && 'Order Prepared for WhatsApp'}
            </h2>
          </div>

          <button
            onClick={closeModal}
            style={{
              background: 'transparent',
              padding: '6px',
              borderRadius: '50%',
              color: 'var(--text-muted)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          
          {/* STEP 1: CUSTOMER FORM */}
          {step === 1 && (
            <form onSubmit={handleProceedToSummary}>
              
              {/* Product mini banner */}
              <div
                style={{
                  background: 'var(--bg-blush-soft)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <img
                  src={orderItems[0].image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80'}
                  alt={orderItems[0].name}
                  style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {orderItems.length === 1 ? `Code: ${orderItems[0].code}` : `${orderItems.length} Products Selected`}
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600 }}>
                    {orderItems.length === 1 ? orderItems[0].name : 'Fashion Jewellery Bag'}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-rosegold-dark)' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Quantity modifier if single product */}
                {orderItems.length === 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty:</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#FFF', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(0, orderItems[0].quantity - 1)}
                        style={{ padding: '4px 10px', background: 'transparent' }}
                      >-</button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, padding: '0 4px' }}>{orderItems[0].quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(0, orderItems[0].quantity + 1)}
                        style={{ padding: '4px 10px', background: 'transparent' }}
                      >+</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                
                {/* Full Name */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Full Name <span style={{ color: '#D64045' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    style={{ borderColor: formErrors.fullName ? '#D64045' : 'var(--border-light)' }}
                  />
                  {formErrors.fullName && (
                    <span style={{ color: '#D64045', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                      {formErrors.fullName}
                    </span>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Mobile Number <span style={{ color: '#D64045' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    style={{ borderColor: formErrors.mobileNumber ? '#D64045' : 'var(--border-light)' }}
                  />
                  {formErrors.mobileNumber && (
                    <span style={{ color: '#D64045', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                      {formErrors.mobileNumber}
                    </span>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    WhatsApp Number <span style={{ color: '#D64045' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit WhatsApp number"
                    maxLength={10}
                    disabled={formData.sameAsMobile}
                    value={formData.sameAsMobile ? formData.mobileNumber : formData.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    style={{
                      background: formData.sameAsMobile ? '#F8F4F4' : '#FFF',
                      borderColor: formErrors.whatsappNumber ? '#D64045' : 'var(--border-light)'
                    }}
                  />
                  {formErrors.whatsappNumber && (
                    <span style={{ color: '#D64045', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                      {formErrors.whatsappNumber}
                    </span>
                  )}
                </div>

                {/* WhatsApp checkbox */}
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-6px' }}>
                  <input
                    type="checkbox"
                    id="sameAsMobile"
                    checked={formData.sameAsMobile}
                    onChange={handleCheckboxChange}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-rosegold)', cursor: 'pointer' }}
                  />
                  <label htmlFor="sameAsMobile" style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    WhatsApp number is same as mobile number
                  </label>
                </div>

                {/* Email (Optional) */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Email Address <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.emailAddress}
                    onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  />
                </div>

                {/* Delivery Address */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Delivery Address <span style={{ color: '#D64045' }}>*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="House/Flat number, building name, street, area landmark"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    style={{ borderColor: formErrors.deliveryAddress ? '#D64045' : 'var(--border-light)' }}
                  />
                  {formErrors.deliveryAddress && (
                    <span style={{ color: '#D64045', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                      {formErrors.deliveryAddress}
                    </span>
                  )}
                </div>

                {/* Taluk (Optional) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Taluk <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mathuranthagam"
                    value={formData.taluk || ''}
                    onChange={(e) => handleInputChange('taluk', e.target.value)}
                  />
                </div>

                {/* City */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    City <span style={{ color: '#D64045' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chengalpattu / Chennai"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    style={{ borderColor: formErrors.city ? '#D64045' : 'var(--border-light)' }}
                  />
                  {formErrors.city && (
                    <span style={{ color: '#D64045', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                      {formErrors.city}
                    </span>
                  )}
                </div>

                {/* State */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    State <span style={{ color: '#D64045' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tamil Nadu"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    style={{ borderColor: formErrors.state ? '#D64045' : 'var(--border-light)' }}
                  />
                  {formErrors.state && (
                    <span style={{ color: '#D64045', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                      {formErrors.state}
                    </span>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Pincode <span style={{ color: '#D64045' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit pincode (e.g. 603201)"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    style={{ borderColor: formErrors.pincode ? '#D64045' : 'var(--border-light)' }}
                  />
                  {formErrors.pincode && (
                    <span style={{ color: '#D64045', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                      {formErrors.pincode}
                    </span>
                  )}
                </div>

                {/* Gift Order Toggle */}
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-blush-soft, #FFF8F9)', borderRadius: 'var(--radius-sm, 6px)', border: '1px solid var(--border-light, #FFE0E6)' }}>
                  <input
                    type="checkbox"
                    id="isGiftCheckbox"
                    checked={!!formData.isGift}
                    onChange={(e) => handleInputChange('isGift', e.target.checked)}
                    style={{ width: 'auto', cursor: 'pointer' }}
                  />
                  <label htmlFor="isGiftCheckbox" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', margin: 0 }}>
                    🎁 Mark as Gift Order (Special gift wrapping)
                  </label>
                </div>

                {/* Additional Message */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, marginBottom: '6px' }}>
                    Special Note / Additional Instructions <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please pack as a gift or call before delivery"
                    value={formData.additionalMessage}
                    onChange={(e) => handleInputChange('additionalMessage', e.target.value)}
                  />
                </div>

              </div>

              {/* Form Action */}
              <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                  <span>Review Order</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: ORDER SUMMARY */}
          {step === 2 && (
            <div>
              
              {/* Clean Summary Card */}
              <div
                style={{
                  background: 'var(--bg-blush-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  padding: '24px',
                  marginBottom: '24px'
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    letterSpacing: '0.04em',
                    marginBottom: '16px',
                    borderBottom: '1px solid var(--border-light)',
                    paddingBottom: '8px'
                  }}
                >
                  ORDER SUMMARY
                </h3>

                {/* Products Breakdown */}
                {orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: '1px dashed var(--border-light)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Product Code: <strong style={{ color: 'var(--text-secondary)' }}>{item.code}</strong> | Qty: {item.quantity} x ₹{item.unitPrice}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}

                {/* Grand Total */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '2px solid var(--border-hover)'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600 }}>Total Amount:</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-rosegold-dark)' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Customer & Delivery Verification Box */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  padding: '20px',
                  marginBottom: '24px'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-rosegold-dark)', marginBottom: '8px' }}>
                    CUSTOMER DETAILS
                  </h4>
                  <div style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                    <div><strong>Name:</strong> {formData.fullName}</div>
                    <div><strong>Mobile:</strong> {formData.mobileNumber}</div>
                    <div><strong>WhatsApp:</strong> {formData.sameAsMobile ? formData.mobileNumber : formData.whatsappNumber}</div>
                    {formData.emailAddress && <div><strong>Email:</strong> {formData.emailAddress}</div>}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-rosegold-dark)', marginBottom: '8px' }}>
                    DELIVERY DETAILS
                  </h4>
                  <div style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                    <div>{formData.deliveryAddress}</div>
                    <div>{formData.city}, {formData.state}</div>
                    <div><strong>Pincode:</strong> {formData.pincode}</div>
                    {formData.additionalMessage && (
                      <div style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                        Note: "{formData.additionalMessage}"
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Informational Guidance Note */}
              <div
                style={{
                  background: 'var(--bg-blush-soft)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}
              >
                <ShieldCheck size={20} color="var(--accent-rosegold-dark)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  <strong>Direct WhatsApp Ordering:</strong> Clicking below will launch WhatsApp with your pre-filled order text. You can review the message and tap Send directly to the boutique owner.
                </p>
              </div>

              {/* Step 2 Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleContinueToWhatsApp}
                  disabled={isSubmitting}
                  className="btn-whatsapp"
                  style={{ padding: '12px 28px', fontSize: '0.92rem' }}
                >
                  <MessageCircle size={18} />
                  <span>Continue to WhatsApp</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: POST-CLICK CONFIRMATION GUIDANCE */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#E8F9EE',
                  color: '#25D366',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', marginBottom: '10px' }}>
                WhatsApp Opened!
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                Your order details have been prepared for the shop owner. Please review the pre-filled message in WhatsApp and <strong>press Send</strong> to complete your order inquiry.
              </p>

              <div
                style={{
                  background: 'var(--bg-blush-soft)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  maxWidth: '480px',
                  margin: '0 auto 28px auto',
                  textAlign: 'left',
                  fontSize: '0.84rem'
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                  What happens next?
                </div>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <li>The boutique owner will verify current product stock on WhatsApp.</li>
                  <li>You will receive direct payment details (UPI/GPay/Bank) from the owner.</li>
                  <li>Your parcel will be packed safely and dispatched with tracking.</li>
                </ul>
              </div>

              <button onClick={closeModal} className="btn-primary" style={{ padding: '12px 32px' }}>
                Done / Back to Website
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
