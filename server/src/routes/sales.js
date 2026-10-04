const express = require('express');
const router = express.Router();
const { Sale, Product, Category } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Admin: Get Dashboard Stats
router.get('/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ availability: 'available' });
    const soldOutProducts = await Product.countDocuments({ availability: 'sold_out' });
    const totalCategories = await Category.countDocuments();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todaySalesData = await Sale.aggregate([
      { $match: { sale_date: { $gte: startOfToday } } },
      {
        $group: {
          _id: null,
          sales: { $sum: '$total_revenue' },
          profit: { $sum: '$total_profit' },
          items_sold: { $sum: '$quantity' }
        }
      }
    ]);

    const monthlySalesData = await Sale.aggregate([
      { $match: { sale_date: { $gte: startOfMonth } } },
      {
        $group: {
          _id: null,
          sales: { $sum: '$total_revenue' },
          profit: { $sum: '$total_profit' },
          items_sold: { $sum: '$quantity' }
        }
      }
    ]);

    const todayStats = todaySalesData[0] || { sales: 0, profit: 0, items_sold: 0 };
    const monthlyStats = monthlySalesData[0] || { sales: 0, profit: 0, items_sold: 0 };

    res.json({
      products: {
        total: totalProducts,
        available: availableProducts,
        sold_out: soldOutProducts,
        categories: totalCategories
      },
      today: todayStats,
      monthly: monthlyStats
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: err.message });
  }
});

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
    const { product_id, product_name, product_code, quantity, unit_selling_price, unit_purchase_cost, notes, sale_date } = req.body;
    const qty = Number(quantity) || 1;
    const sellPrice = Number(unit_selling_price) || 0;
    const costPrice = Number(unit_purchase_cost) || 0;

    const total_revenue = qty * sellPrice;
    const total_cost = qty * costPrice;
    const total_profit = total_revenue - total_cost;

    const sale = await Sale.create({
      product_id: product_id || null,
      product_name,
      product_code,
      quantity: qty,
      unit_selling_price: sellPrice,
      unit_purchase_cost: costPrice,
      total_revenue,
      total_cost,
      total_profit,
      notes,
      sale_date: sale_date ? new Date(sale_date) : new Date()
    });
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
