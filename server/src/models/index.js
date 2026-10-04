const mongoose = require('mongoose');

// Admin User
const adminUserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Category
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  image_url: { type: String, required: true },
  description: String,
  sort_order: { type: Number, default: 0 }
});

// Product Image
const productImageSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  sort_order: { type: Number, default: 0 },
  is_primary: { type: Boolean, default: false }
});

// Product
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: String,
  purchase_cost: { type: Number, default: 0 },
  selling_price: { type: Number, default: 0 },
  stock_quantity: { type: Number, default: 0 },
  availability: { type: String, default: 'available', enum: ['available', 'sold_out'] },
  colour: { type: String, default: 'Rose Gold' },
  is_featured: { type: Boolean, default: false },
  images: [productImageSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Sale
const saleSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  product_name: { type: String, required: true },
  product_code: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit_selling_price: { type: Number, required: true },
  unit_purchase_cost: { type: Number, required: true },
  total_revenue: { type: Number, required: true },
  total_cost: { type: Number, required: true },
  total_profit: { type: Number, required: true },
  notes: String,
  sale_date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now }
});

// Website Setting
const settingSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: String, required: true }
});

// Order Inquiry
const orderInquirySchema = new mongoose.Schema({
  order_code: { type: String, unique: true, required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  product_name: { type: String, required: true },
  product_code: { type: String, required: true },
  quantity: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  customer_name: { type: String, required: true },
  customer_mobile: { type: String, required: true },
  customer_whatsapp: { type: String, required: true },
  customer_email: String,
  delivery_address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  message: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = {
  AdminUser: mongoose.model('AdminUser', adminUserSchema),
  Category: mongoose.model('Category', categorySchema),
  Product: mongoose.model('Product', productSchema),
  Sale: mongoose.model('Sale', saleSchema),
  Setting: mongoose.model('Setting', settingSchema),
  OrderInquiry: mongoose.model('OrderInquiry', orderInquirySchema)
};
