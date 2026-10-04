const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if custom DNS fallback isn't supported in current environment
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not set in .env file');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'Nithisha Collection', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Serve frontend
const clientDist = path.join(__dirname, '../../client/dist');
if (require('fs').existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Connect MongoDB Atlas then start
console.log('Connecting to MongoDB Atlas...');
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  family: 4
})
  .then(async () => {
    console.log('✅ MongoDB Atlas connected successfully!');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Nithisha Collection server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('\n❌ MongoDB Atlas connection failed:', err.message);
    console.error('\nTo resolve this connection issue:');
    console.error('1. Go to https://cloud.mongodb.com and log in to your Atlas account.');
    console.error('2. Go to Security -> Network Access.');
    console.error('3. Click "Add IP Address" and click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) or add your current IP.');
    console.error('4. Save changes, wait 1 minute for Atlas to update, then restart the server.\n');
    process.exit(1);
  });

async function seedDatabase() {
  const { AdminUser, Category, Setting } = require('./models');
  const bcrypt = require('bcryptjs');

  // Admin user
  const adminExists = await AdminUser.findOne({ username: 'admin' });
  if (!adminExists) {
    const hash = bcrypt.hashSync('LurelleAdmin2025!', 10);
    await AdminUser.create({ username: 'admin', password_hash: hash });
    console.log('Admin user created: admin / LurelleAdmin2025!');
  }

  // Settings
  const settingsCount = await Setting.countDocuments();
  if (settingsCount === 0) {
    const defaults = [
      ['shop_name', 'Nithisha Collection'],
      ['tagline', 'Your little world of pretty things'],
      ['logo_text', 'Nithisha Collection'],
      ['hero_badge', 'Accessories - Styles - Elegance'],
      ['hero_title', 'Jewellery That Tells Your Story'],
      ['hero_subtitle', 'Elegant, affordable and uniquely you.'],
      ['hero_image', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1920&q=85'],
      ['hero_image_2', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1920&q=85'],
      ['hero_image_3', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1920&q=85'],
      ['whatsapp_number', '+919080772273'],
      ['phone_number', '+91 90807 72273'],
      ['email', 'hello@nithishacollection.in'],
      ['instagram_url', 'https://instagram.com/nithisha_collection'],
      ['shop_address', 'Chennai, Tamil Nadu'],
      ['opening_hours', 'Mon - Sat: 10:30 AM - 8:30 PM'],
      ['about_title', 'Crafting Everyday Luxury for Every Woman'],
      ['about_story', 'Founded with a passion for modern elegance, Nithisha Collection brings you premium fashion jewellery.'],
      ['about_philosophy', 'Every design is handpicked for impeccable craftsmanship and radiant finishing.'],
      ['about_quality', 'Skin-friendly alloys, durable high-grade plating, premium cubic zirconia.'],
      ['about_image', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80']
    ];
    await Setting.insertMany(defaults.map(([key, value]) => ({ key, value })));
    console.log('Default settings seeded');
  }

  // Categories
  const catCount = await Category.countDocuments();
  if (catCount === 0) {
    await Category.insertMany([
      { name: 'Earrings', slug: 'earrings', image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', description: 'Chandelier drops, pearl studs, celestial huggies & statement jhumkas.', sort_order: 1 },
      { name: 'Necklaces', slug: 'necklaces', image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', description: 'Delicate layered chains, crystal chokers, and graceful pendant sets.', sort_order: 2 },
      { name: 'Rings', slug: 'rings', image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', description: 'Stackable bands, adjustable cocktail rings, and crystal solitaires.', sort_order: 3 },
      { name: 'Bracelets', slug: 'bracelets', image_url: 'https://images.unsplash.com/photo-1611591475819-79b8b738982a?auto=format&fit=crop&w=800&q=80', description: 'Tennis sparkle bracelets, dainty charm chains, and sleek cuff bands.', sort_order: 4 },
      { name: 'Bangles', slug: 'bangles', image_url: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=800&q=80', description: 'Modern kada bangles, enamel stack sets.', sort_order: 5 },
      { name: 'Anklets', slug: 'anklets', image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80', description: 'Delicate payals, bohemian bead anklets.', sort_order: 6 },
      { name: 'Jewellery Sets', slug: 'jewellery-sets', image_url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80', description: 'Coordinated festive suites and bridal party sets.', sort_order: 7 },
      { name: 'Hair Accessories', slug: 'hair-accessories', image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80', description: 'Pearl barrettes, crystal bridal pins.', sort_order: 8 }
    ]);
    console.log('Categories seeded');
  }
}
