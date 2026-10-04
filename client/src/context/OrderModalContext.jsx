import React, { createContext, useContext, useState } from 'react';
import { useSettings } from './SettingsContext';

const OrderModalContext = createContext(null);

export function OrderModalProvider({ children }) {
  const { settings } = useSettings();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1 = Details, 2 = Summary, 3 = Confirmation note
  const [orderItems, setOrderItems] = useState([]); // Array of { product, quantity, unitPrice }

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    whatsappNumber: '',
    sameAsMobile: true,
    emailAddress: '',
    deliveryAddress: '',
    taluk: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    isGift: false,
    additionalMessage: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Single product BUY NOW trigger
  const openBuyNow = (product, quantity = 1) => {
    const catName = typeof product.category === 'object' ? (product.category?.name || 'Earrings') : (product.category || 'Earrings');
    setOrderItems([{
      id: product.id,
      name: product.name,
      code: product.code || product.sku || 'JW-1001',
      unitPrice: product.selling_price || product.price || 0,
      quantity: Math.max(1, quantity),
      category: catName,
      productType: product.product_type || 'Fashion Jewellery',
      image: product.primary_image || (product.images && product.images[0] ? (product.images[0].image_url || product.images[0]) : null)
    }]);
    setStep(1);
    setFormErrors({});
    setIsOpen(true);
  };

  // Full Cart checkout trigger
  const openCartCheckout = (cartItems) => {
    if (!cartItems || cartItems.length === 0) return;
    setOrderItems(cartItems.map(item => {
      const catName = typeof item.category === 'object' ? (item.category?.name || 'Earrings') : (item.category || 'Earrings');
      return {
        id: item.id,
        name: item.name,
        code: item.code || item.sku || 'JW-1001',
        unitPrice: item.selling_price || item.price || 0,
        quantity: item.quantity || 1,
        category: catName,
        productType: item.product_type || 'Fashion Jewellery',
        image: item.primary_image || item.image || (item.images && item.images[0] ? (item.images[0].image_url || item.images[0]) : null)
      };
    }));
    setStep(1);
    setFormErrors({});
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setStep(1);
  };

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    setOrderItems(prev => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  // Field validation
  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your full name';
    }

    const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    const effectiveWhatsApp = formData.sameAsMobile ? formData.mobileNumber : formData.whatsappNumber;
    const cleanWA = effectiveWhatsApp.replace(/\D/g, '');
    if (!cleanWA || cleanWA.length < 10) {
      errors.whatsappNumber = 'Please enter a valid 10-digit WhatsApp number';
    }

    if (!formData.deliveryAddress.trim()) {
      errors.deliveryAddress = 'Please enter your complete delivery address';
    }

    if (!formData.city.trim()) {
      errors.city = 'Please enter your city';
    }

    if (!formData.state.trim()) {
      errors.state = 'Please enter your state';
    }

    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errors.pincode = 'Please enter a valid 6-digit postal pincode';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate WhatsApp Message & URL
  const generateWhatsAppUrl = () => {
    const rawNumber = settings.whatsapp_number || '+919080772273';
    const cleanOwnerNumber = rawNumber.replace(/[^0-9]/g, '');

    const effectiveWhatsApp = formData.sameAsMobile ? formData.mobileNumber : formData.whatsappNumber;

    // Helper to format image URL into a clean, clickable HTTP/HTTPS link on WhatsApp
    const getCleanImageUrl = (img) => {
      if (!img || typeof img !== 'string') return '';
      const trimmed = img.trim();
      // Skip long base64 data URIs to avoid wall of text in WhatsApp
      if (trimmed.startsWith('data:')) return '';
      // Convert relative paths (/uploads/...) to full clickable web URLs
      if (trimmed.startsWith('/')) {
        return `${window.location.origin}${trimmed}`;
      }
      return trimmed;
    };

    let itemsText = '';
    if (orderItems.length === 1) {
      const it = orderItems[0];
      const imgUrl = getCleanImageUrl(it.image);
      itemsText = `🛍️ PRODUCT DETAILS
Product Name: ${it.name}
Product Code: ${it.code}
Category: ${it.category || 'Earrings'}
Product Type: ${it.productType || 'Fashion Jewellery'}
Quantity: ${it.quantity}
Unit Price: ₹${Number(it.unitPrice).toLocaleString('en-IN')}
Total Price: ₹${(Number(it.unitPrice) * Number(it.quantity)).toLocaleString('en-IN')}${imgUrl ? '\n🖼️ Product Image: ' + imgUrl : ''}`;
    } else {
      itemsText = orderItems.map((it, idx) => {
        const imgUrl = getCleanImageUrl(it.image);
        return `🛍️ PRODUCT DETAILS (${idx + 1}/${orderItems.length})
Product Name: ${it.name}
Product Code: ${it.code}
Category: ${it.category || 'Earrings'}
Product Type: ${it.productType || 'Fashion Jewellery'}
Quantity: ${it.quantity}
Unit Price: ₹${Number(it.unitPrice).toLocaleString('en-IN')}
Total Price: ₹${(Number(it.unitPrice) * Number(it.quantity)).toLocaleString('en-IN')}${imgUrl ? '\n🖼️ Product Image: ' + imgUrl : ''}`;
      }).join('\n\n') + `\n\nGrand Total: ₹${totalAmount.toLocaleString('en-IN')}`;
    }

    const message = `Hello! I would like to place an order from ${settings.shop_name || 'Nithisha Collection'}. ❤️

${itemsText}

👤 CUSTOMER DETAILS
Customer Name: ${formData.fullName.trim()}
Mobile Number: ${formData.mobileNumber.trim()}
WhatsApp Number: ${effectiveWhatsApp.trim()}${formData.emailAddress.trim() ? '\nEmail: ' + formData.emailAddress.trim() : ''}

🚚 DELIVERY DETAILS
Address: ${formData.deliveryAddress.trim()}${formData.taluk.trim() ? '\nTaluk: ' + formData.taluk.trim() : ''}
City: ${formData.city.trim()}
State: ${formData.state.trim()}
Pincode: ${formData.pincode.trim()}

📝 ADDITIONAL INFORMATION
Gift: ${formData.isGift ? 'Yes' : 'No'}${formData.additionalMessage.trim() ? '\nSpecial Note: ' + formData.additionalMessage.trim() : ''}

Please confirm availability and payment details. Thank you!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanOwnerNumber}?text=${encoded}`;

    // Log inquiry to backend silently
    try {
      fetch('/api/orders/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: orderItems[0]?.id || null,
          product_name: orderItems.map(i => i.name).join(', '),
          product_code: orderItems.map(i => i.code).join(', '),
          quantity: orderItems.reduce((acc, i) => acc + i.quantity, 0),
          total_amount: totalAmount,
          customer_name: formData.fullName,
          customer_mobile: formData.mobileNumber,
          customer_whatsapp: effectiveWhatsApp,
          customer_email: formData.emailAddress,
          delivery_address: formData.deliveryAddress,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          message: formData.additionalMessage
        })
      }).catch(() => {});
    } catch {}

    return { waUrl, message };
  };

  return (
    <OrderModalContext.Provider value={{
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
      openBuyNow,
      openCartCheckout,
      closeModal,
      validateForm,
      generateWhatsAppUrl
    }}>
      {children}
    </OrderModalContext.Provider>
  );
}

export function useOrderModal() {
  const context = useContext(OrderModalContext);
  if (!context) {
    throw new Error('useOrderModal must be used within OrderModalProvider');
  }
  return context;
}
