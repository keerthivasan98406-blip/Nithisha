const express = require('express');
const router = express.Router();
const { OrderInquiry } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Public: Log inquiry
router.post('/inquiry', async (req, res) => {
  try {
    const {
      product_id, product_name, product_code, quantity = 1,
      total_amount, customer_name, customer_mobile, customer_whatsapp,
      customer_email, delivery_address, city, state, pincode, message
    } = req.body;

    if (!customer_name || !customer_mobile || !delivery_address || !city || !state || !pincode) {
      return res.status(400).json({ error: 'Required customer and delivery details missing.' });
    }

    const orderCode = 'NC-' + Math.floor(100000 + Math.random() * 900000);

    const inquiry = await OrderInquiry.create({
      order_code: orderCode,
      product_id: product_id || null,
      product_name: product_name || 'Jewellery Selection',
      product_code: product_code || 'MULTI',
      quantity: Number(quantity) || 1,
      total_amount: Number(total_amount) || 0,
      customer_name, customer_mobile,
      customer_whatsapp: customer_whatsapp || customer_mobile,
      customer_email: customer_email || '',
      delivery_address, city, state, pincode,
      message: message || ''
    });

    res.status(201).json({ success: true, order_code: orderCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: View inquiries
router.get('/inquiries', authenticateToken, async (req, res) => {
  try {
    const inquiries = await OrderInquiry.find({}).sort({ created_at: -1 }).limit(50);
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
