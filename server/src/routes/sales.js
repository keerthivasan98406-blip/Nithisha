const express = require('express');
const router = express.Router();
const { Sale } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Admin: Get all sales
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sales = await Sale.find({}).sort({ sale_date: -1 }).limit(100);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get sales summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: null,
          total_revenue: { $sum: '$total_revenue' },
          total_cost: { $sum: '$total_cost' },
          total_profit: { $sum: '$total_profit' },
          total_orders: { $sum: 1 }
        }
      }
    ]);
    res.json(result[0] || { total_revenue: 0, total_cost: 0, total_profit: 0, total_orders: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create sale
router.post('/', authenticateToken, async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete sale
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
