const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'lurelle.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image_url TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      category_id INTEGER NOT NULL,
      description TEXT,
      purchase_cost REAL NOT NULL DEFAULT 0,
      selling_price REAL NOT NULL DEFAULT 0,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      availability TEXT NOT NULL DEFAULT 'available', -- 'available' or 'sold_out'
      colour TEXT DEFAULT 'Rose Gold',
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_primary INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      product_code TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_selling_price REAL NOT NULL,
      unit_purchase_cost REAL NOT NULL,
      total_revenue REAL NOT NULL,
      total_cost REAL NOT NULL,
      total_profit REAL NOT NULL,
      notes TEXT,
      sale_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS website_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT UNIQUE NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      product_code TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      customer_name TEXT NOT NULL,
      customer_mobile TEXT NOT NULL,
      customer_whatsapp TEXT NOT NULL,
      customer_email TEXT,
      delivery_address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function seedDatabase() {
  // 1. Seed Admin User
  const adminExists = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
  if (!adminExists) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('LurelleAdmin2025!', salt);
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', passwordHash);
    console.log('Seeded default admin user: admin / LurelleAdmin2025!');
  }

  // 2. Seed Website Settings
  const defaultSettings = [
    ['shop_name', 'Nithisha Collection'],
    ['tagline', 'Your little world of pretty things'],
    ['logo_text', 'Nithisha Collection'],
    ['hero_badge', 'Accessories · Styles · Elegance'],
    ['hero_title', 'Jewellery That Tells Your Story'],
    ['hero_subtitle', 'Elegant, affordable and uniquely you.'],
    ['hero_image', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1920&q=85'],
    ['hero_image_2', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1920&q=85'],
    ['hero_image_3', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1920&q=85'],
    ['whatsapp_number', '+919080772273'],
    ['phone_number', '+91 90807 72273'],
    ['email', 'hello@nithishacollection.in'],
    ['instagram_url', 'https://instagram.com/nithisha_collection'],
    ['shop_address', 'Boutique Suite 402, Rosewood Avenue, Anna Nagar, Chennai, Tamil Nadu 600040'],
    ['opening_hours', 'Mon - Sat: 10:30 AM – 8:30 PM | Sun: 11:00 AM – 7:00 PM'],
    ['about_title', 'Crafting Everyday Luxury for Every Woman'],
    ['about_story', 'Founded with a passion for modern elegance, Nithisha Collection brings you premium, runway-inspired fashion jewellery without luxury markups. We believe that stunning jewellery shouldn’t be reserved only for royal lockers or rare weddings—it belongs in your everyday moments, your celebrations, and your personal style story.'],
    ['about_philosophy', 'From anti-tarnish everyday rings to show-stopping cocktail earrings, every design in our catalogue is handpicked for impeccable craftsmanship, lightweight comfort, and radiant finishing.'],
    ['about_quality', 'Skin-friendly alloys, durable high-grade plating, premium cubic zirconia, baroque faux pearls, and artisan enamel—curated to stay brilliant.'],
    ['about_image', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80'],
    ['owner_name', 'Nithisha'],
    ['owner_title', 'Boutique Owner & Lead Curator'],
    ['owner_email', 'hello@nithishacollection.in'],
    ['owner_phone', '+91 90807 72273'],
    ['owner_image', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80']
  ];

  const insertSetting = db.prepare('INSERT OR IGNORE INTO website_settings (key, value) VALUES (?, ?)');
  for (const [k, v] of defaultSettings) {
    insertSetting.run(k, v);
  }

  // 3. Seed Categories
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  if (categoryCount === 0) {
    const categories = [
      {
        name: 'Earrings',
        slug: 'earrings',
        image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        description: 'Chandelier drops, pearl studs, celestial huggies & statement jhumkas.',
        sort_order: 1
      },
      {
        name: 'Necklaces',
        slug: 'necklaces',
        image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        description: 'Delicate layered chains, crystal chokers, and graceful pendant sets.',
        sort_order: 2
      },
      {
        name: 'Rings',
        slug: 'rings',
        image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        description: 'Stackable bands, adjustable cocktail rings, and crystal solitaires.',
        sort_order: 3
      },
      {
        name: 'Bracelets',
        slug: 'bracelets',
        image_url: 'https://images.unsplash.com/photo-1611591475819-79b8b738982a?auto=format&fit=crop&w=800&q=80',
        description: 'Tennis sparkle bracelets, dainty charm chains, and sleek cuff bands.',
        sort_order: 4
      },
      {
        name: 'Bangles',
        slug: 'bangles',
        image_url: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=800&q=80',
        description: 'Modern kada bangles, enamel stack sets, and etched wrist candy.',
        sort_order: 5
      },
      {
        name: 'Anklets',
        slug: 'anklets',
        image_url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
        description: 'Delicate payals, bohemian bead anklets, and whimsical charm bells.',
        sort_order: 6
      },
      {
        name: 'Jewellery Sets',
        slug: 'jewellery-sets',
        image_url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
        description: 'Coordinated festive suites, party ensembles, and bridal party sets.',
        sort_order: 7
      },
      {
        name: 'Hair Accessories',
        slug: 'hair-accessories',
        image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
        description: 'Pearl barrettes, crystal bridal pins, and romantic hair vine bands.',
        sort_order: 8
      }
    ];

    const insertCat = db.prepare('INSERT INTO categories (name, slug, image_url, description, sort_order) VALUES (?, ?, ?, ?, ?)');
    for (const cat of categories) {
      insertCat.run(cat.name, cat.slug, cat.image_url, cat.description, cat.sort_order);
    }
    console.log('Seeded 8 jewellery categories.');
  }

  // 4. Seed Products
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (productCount === 0) {
    const catMap = {};
    const allCats = db.prepare('SELECT id, slug FROM categories').all();
    for (const c of allCats) {
      catMap[c.slug] = c.id;
    }

    const products = [
      // Earrings
      {
        name: 'Pearl Drop Chandelier Earrings',
        code: 'ER-1024',
        category_id: catMap['earrings'],
        description: 'Exquisite baroque teardrop faux pearls cascading beneath rose-gold plated floral filigree. Lightweight with hypoallergenic surgical steel posts.',
        purchase_cost: 210,
        selling_price: 499,
        stock_quantity: 18,
        availability: 'available',
        colour: 'Rose Gold & Pearl White',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Blush Crystal Celestial Huggies',
        code: 'ER-1025',
        category_id: catMap['earrings'],
        description: 'Mini huggie hoops adorned with blush pink zirconia stars and micro pavé crystals. Perfect for everyday luxury stacking.',
        purchase_cost: 160,
        selling_price: 380,
        stock_quantity: 24,
        availability: 'available',
        colour: 'Blush Pink',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Petal Bloom Enamel Jhumki',
        code: 'ER-1026',
        category_id: catMap['earrings'],
        description: 'Festive floral top with delicate baby-pink hand-painted meenakari enamel and tiny pearl fringe bells.',
        purchase_cost: 290,
        selling_price: 649,
        stock_quantity: 12,
        availability: 'available',
        colour: 'Powder Pink & Gold',
        is_featured: 0,
        images: [
          'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80'
        ]
      },

      // Necklaces
      {
        name: 'Dainty Rose Quartz Solitaire Pendant',
        code: 'NK-2045',
        category_id: catMap['necklaces'],
        description: 'Natural-cut soft pink faceted crystal pendant set in a micro-prong rose gold setting on an 18-inch adjustable paperclip chain.',
        purchase_cost: 280,
        selling_price: 699,
        stock_quantity: 15,
        availability: 'available',
        colour: 'Rose Gold & Pink',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Tiered Shimmer Layered Choker',
        code: 'NK-2046',
        category_id: catMap['necklaces'],
        description: 'Double layered fashion necklace featuring a sleek herringbone choker paired with a sparkling bezel cubic zirconia drop.',
        purchase_cost: 320,
        selling_price: 749,
        stock_quantity: 9,
        availability: 'available',
        colour: 'Rose Gold',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1611591475819-79b8b738982a?auto=format&fit=crop&w=800&q=80'
        ]
      },

      // Rings
      {
        name: 'Aura Adjustable Marquise Crystal Ring',
        code: 'RG-3012',
        category_id: catMap['rings'],
        description: 'V-shaped marquise brilliant crystals in blush champagne tones. Free-size open band comfortably fits any finger.',
        purchase_cost: 140,
        selling_price: 349,
        stock_quantity: 30,
        availability: 'available',
        colour: 'Rose Gold & Crystal',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Vintage Blossom Cocktail Ring',
        code: 'RG-3013',
        category_id: catMap['rings'],
        description: 'High-fashion statement floral motif ring with multi-faceted pastel crystals and a central luminous simulated pearl.',
        purchase_cost: 210,
        selling_price: 520,
        stock_quantity: 8,
        availability: 'available',
        colour: 'Blush & Champagne',
        is_featured: 0,
        images: [
          'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80'
        ]
      },

      // Bracelets
      {
        name: 'Lustre Crystal Tennis Slider Bracelet',
        code: 'BR-4018',
        category_id: catMap['bracelets'],
        description: 'Continuous ribbon of claw-set 3mm cubic zirconia crystals with a bolo slider bead for a snug custom fit.',
        purchase_cost: 250,
        selling_price: 599,
        stock_quantity: 20,
        availability: 'available',
        colour: 'Rose Gold',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Enchanted Butterfly Charm Bracelet',
        code: 'BR-4019',
        category_id: catMap['bracelets'],
        description: 'Delicate rolo chain studded with opalescent resin butterflies and tiny faceted quartz beads.',
        purchase_cost: 180,
        selling_price: 449,
        stock_quantity: 0,
        availability: 'sold_out',
        colour: 'Soft Pink',
        is_featured: 0,
        images: [
          'https://images.unsplash.com/photo-1611591475819-79b8b738982a?auto=format&fit=crop&w=800&q=80'
        ]
      },

      // Bangles
      {
        name: 'Opulence Sleek Rose Kada Bangles (Pair)',
        code: 'BG-5021',
        category_id: catMap['bangles'],
        description: 'Set of two minimalist openable hinge bangles with channel-set pavé crystals. Anti-tarnish polished finish.',
        purchase_cost: 410,
        selling_price: 999,
        stock_quantity: 14,
        availability: 'available',
        colour: 'Rose Gold',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Pastel Enamel Stackable Bangles (Set of 4)',
        code: 'BG-5022',
        category_id: catMap['bangles'],
        description: 'Four slender coordinating bangles with soft blush pink and ivory vitreous enamel stripes.',
        purchase_cost: 340,
        selling_price: 799,
        stock_quantity: 11,
        availability: 'available',
        colour: 'Blush Pink & Ivory',
        is_featured: 0,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
        ]
      },

      // Anklets
      {
        name: 'Whisper Bells Rose Gold Anklet',
        code: 'AK-6009',
        category_id: catMap['anklets'],
        description: 'Ultra-light curb chain with micro tinkling bells and pink cubic zirconia drops. Includes 2-inch extender chain.',
        purchase_cost: 130,
        selling_price: 320,
        stock_quantity: 19,
        availability: 'available',
        colour: 'Rose Gold',
        is_featured: 0,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Boho Beaded Dual Strand Payal',
        code: 'AK-6010',
        category_id: catMap['anklets'],
        description: 'Two-tier anklet combining tiny blush seed beads and rose gold link chain with evil-eye charm accents.',
        purchase_cost: 160,
        selling_price: 399,
        stock_quantity: 16,
        availability: 'available',
        colour: 'Pink Beads & Rose Gold',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80'
        ]
      },

      // Jewellery Sets
      {
        name: 'Seraphina Royal Festive Choker & Earring Suite',
        code: 'JS-7033',
        category_id: catMap['jewellery-sets'],
        description: 'Showstopper runway suite featuring a multi-strand faux pearl and rose zirconia collar choker with matching chandelier earrings and maang tikka.',
        purchase_cost: 650,
        selling_price: 1499,
        stock_quantity: 7,
        availability: 'available',
        colour: 'Rose Gold & Blush Pearls',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Duo Radiance Minimalist Pendant & Stud Set',
        code: 'JS-7034',
        category_id: catMap['jewellery-sets'],
        description: 'Everyday fine look-alike set featuring a floating teardrop rose quartz pendant with matching solitaire studs.',
        purchase_cost: 380,
        selling_price: 899,
        stock_quantity: 15,
        availability: 'available',
        colour: 'Rose Gold',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
        ]
      },

      // Hair Accessories
      {
        name: 'Celeste Crystal Vine Hairband',
        code: 'HA-8015',
        category_id: catMap['hair-accessories'],
        description: 'Flexible handcrafted headband studded with branch-like crystal leaves and freshwater-style micro pearls for romantic updos.',
        purchase_cost: 240,
        selling_price: 549,
        stock_quantity: 12,
        availability: 'available',
        colour: 'Rose Gold & Pearls',
        is_featured: 1,
        images: [
          'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        name: 'Luxe French Pearl Barrette Hair Clips (Set of 3)',
        code: 'HA-8016',
        category_id: catMap['hair-accessories'],
        description: 'Trio of snap barrettes adorned with varying sizes of lustrous faux pearls and rose-gold acrylic inlays.',
        purchase_cost: 150,
        selling_price: 349,
        stock_quantity: 22,
        availability: 'available',
        colour: 'Pearl White & Rose Gold',
        is_featured: 0,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ];

    const insertProd = db.prepare(`
      INSERT INTO products (name, code, category_id, description, purchase_cost, selling_price, stock_quantity, availability, colour, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertImg = db.prepare(`
      INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
      VALUES (?, ?, ?, ?)
    `);

    for (const p of products) {
      const info = insertProd.run(
        p.name,
        p.code,
        p.category_id,
        p.description,
        p.purchase_cost,
        p.selling_price,
        p.stock_quantity,
        p.availability,
        p.colour,
        p.is_featured
      );
      const prodId = info.lastInsertRowid;
      p.images.forEach((img, idx) => {
        insertImg.run(prodId, img, idx, idx === 0 ? 1 : 0);
      });
    }
    console.log(`Seeded ${products.length} sample fancy jewellery products.`);
  }

  // 5. Seed Initial Sales records
  const salesCount = db.prepare('SELECT COUNT(*) as count FROM sales').get().count;
  if (salesCount === 0) {
    const todayStr = new Date().toISOString().split('T')[0];
    const prevDate = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
    const prevDate2 = new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0];

    const sampleSales = [
      {
        product_name: 'Pearl Drop Chandelier Earrings',
        product_code: 'ER-1024',
        quantity: 2,
        unit_selling_price: 499,
        unit_purchase_cost: 210,
        total_revenue: 998,
        total_cost: 420,
        total_profit: 578,
        notes: 'WhatsApp order delivered to Anna Nagar',
        sale_date: todayStr
      },
      {
        name: 'Dainty Rose Quartz Solitaire Pendant',
        product_code: 'NK-2045',
        quantity: 3,
        unit_selling_price: 699,
        unit_purchase_cost: 280,
        total_revenue: 2097,
        total_cost: 840,
        total_profit: 1257,
        notes: 'WhatsApp order gift packed for birthday',
        sale_date: todayStr
      },
      {
        name: 'Lustre Crystal Tennis Slider Bracelet',
        product_code: 'BR-4018',
        quantity: 2,
        unit_selling_price: 599,
        unit_purchase_cost: 250,
        total_revenue: 1198,
        total_cost: 500,
        total_profit: 698,
        notes: 'Prepaid order confirmed via WhatsApp',
        sale_date: todayStr
      },
      {
        name: 'Aura Adjustable Marquise Crystal Ring',
        product_code: 'RG-3012',
        quantity: 2,
        unit_selling_price: 349,
        unit_purchase_cost: 140,
        total_revenue: 698,
        total_cost: 280,
        total_profit: 418,
        notes: 'Customer repeat order',
        sale_date: todayStr
      },
      {
        name: 'Seraphina Royal Festive Choker & Earring Suite',
        product_code: 'JS-7033',
        quantity: 5,
        unit_selling_price: 1499,
        unit_purchase_cost: 650,
        total_revenue: 7495,
        total_cost: 3250,
        total_profit: 4245,
        notes: 'Bridal bridesmaids combo pack',
        sale_date: prevDate
      },
      {
        name: 'Opulence Sleek Rose Kada Bangles (Pair)',
        product_code: 'BG-5021',
        quantity: 12,
        unit_selling_price: 999,
        unit_purchase_cost: 410,
        total_revenue: 11988,
        total_cost: 4920,
        total_profit: 7068,
        notes: 'Festival wholesale batch',
        sale_date: prevDate2
      }
    ];

    const insertSale = db.prepare(`
      INSERT INTO sales (product_name, product_code, quantity, unit_selling_price, unit_purchase_cost, total_revenue, total_cost, total_profit, notes, sale_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const s of sampleSales) {
      insertSale.run(
        s.product_name || s.name,
        s.product_code,
        s.quantity,
        s.unit_selling_price,
        s.unit_purchase_cost,
        s.total_revenue,
        s.total_cost,
        s.total_profit,
        s.notes,
        s.sale_date
      );
    }
    console.log('Seeded sample sales records.');
  }
}

initSchema();
seedDatabase();

module.exports = db;
