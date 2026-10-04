const express = require('express');
const router = express.Router();
const { Product, Category } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Public: Get products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, sort = 'created_at', page = 1, limit = 50 } = req.query;
    const filter = {};

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category_id = cat._id;
    }
    if (featured === 'true') filter.is_featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortMap = {
      price_asc: { selling_price: 1 },
      price_desc: { selling_price: -1 },
      newest: { created_at: -1 },
      name_asc: { name: 1 }
    };

    const products = await Product.find(filter)
      .populate('category_id', 'name slug')
      .sort(sortMap[sort] || { created_at: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Format for frontend compatibility
    const formatted = products.map(p => formatProduct(p));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category_id', 'name slug');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(product));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create product
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, code, category_id, description, purchase_cost, selling_price, stock_quantity, availability, colour, is_featured, images } = req.body;

    const product = await Product.create({
      name, code, category_id, description,
      purchase_cost: Number(purchase_cost) || 0,
      selling_price: Number(selling_price) || 0,
      stock_quantity: Number(stock_quantity) || 0,
      availability: availability || 'available',
      colour: colour || 'Rose Gold',
      is_featured: !!is_featured,
      images: (images || []).map((img, idx) => ({
        image_url: img.image_url || img,
        sort_order: idx,
        is_primary: idx === 0
      }))
    });

    res.status(201).json(formatProduct(product));
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Product code already exists' });
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update product
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updates = { ...req.body, updated_at: new Date() };
    if (updates.images) {
      updates.images = updates.images.map((img, idx) => ({
        image_url: img.image_url || img,
        sort_order: idx,
        is_primary: idx === 0
      }));
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('category_id', 'name slug');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(product));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function formatProduct(p) {
  const obj = p.toObject ? p.toObject() : p;
  const primaryImage = obj.images && obj.images.find(i => i.is_primary);
  return {
    ...obj,
    id: obj._id,
    category: obj.category_id,
    primary_image: primaryImage ? primaryImage.image_url : (obj.images && obj.images[0] ? obj.images[0].image_url : null),
    is_featured: obj.is_featured ? 1 : 0
  };
}

module.exports = router;
