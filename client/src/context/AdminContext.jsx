import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

// Initial Realistic Sample Data
const initialProducts = [
  {
    id: 1,
    name: 'Luxe French Baroque Pearl Chandelier Earrings',
    sku: 'ER-1024',
    category: 'Earrings',
    selling_price: 499,
    cost_price: 210,
    profit: 289,
    profit_margin: 57.92,
    stock: 22,
    low_stock_threshold: 8,
    stock_status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'
    ],
    short_description: 'Cascading baroque teardrop faux pearls beneath rose-gold plated floral filigree.',
    detailed_description: 'Exquisite baroque teardrop faux pearls cascading beneath hand-polished rose-gold plated floral filigree. Engineered with hypoallergenic surgical steel posts for featherlight all-day comfort.',
    seo_title: 'Luxe Baroque Pearl Chandelier Earrings | LURELLE',
    meta_description: 'Shop luxury French baroque pearl earrings with rose gold filigree. Hypoallergenic and lightweight.',
    url_slug: 'luxe-baroque-pearl-chandelier-earrings',
    is_featured: true,
    is_active: true,
    tags: ['Baroque Pearl', 'Earrings', 'Rose Gold', 'Bestseller'],
    weight: '14g',
    material: 'High-grade Brass Alloy, Anti-Tarnish 18K Rose Gold Dip, Acrylic Baroque Pearl',
    size: 'Length: 5.5 cm',
    colour: 'Rose Gold & Pearl White',
    collection: 'Royal Heritage'
  },
  {
    id: 2,
    name: 'Blush Crystal Celestial Starlight Huggies',
    sku: 'ER-1025',
    category: 'Earrings',
    selling_price: 349,
    cost_price: 150,
    profit: 199,
    profit_margin: 57.02,
    stock: 5,
    low_stock_threshold: 8,
    stock_status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80'
    ],
    short_description: 'Petite hinged hoops adorned with blush pink cubic zirconia stars and micro pavé crystals.',
    detailed_description: 'Modern everyday luxury. Petite hinged hoops studded with blush pink faceted zirconia starbursts and micro pavé accents. Click-latch secure closure.',
    seo_title: 'Blush Crystal Celestial Huggies | LURELLE',
    meta_description: 'Delicate pink crystal huggie earrings. Anti-tarnish everyday jewellery.',
    url_slug: 'blush-crystal-celestial-huggies',
    is_featured: true,
    is_active: true,
    tags: ['Huggies', 'Zirconia', 'Blush Pink'],
    weight: '6g',
    material: 'Anti-tarnish Copper Alloy, AAAAA Cubic Zirconia',
    size: 'Diameter: 14mm',
    colour: 'Blush Pink & Rose Gold',
    collection: 'Petal Whisper'
  },
  {
    id: 3,
    name: 'Dainty Rose Quartz Solitaire Teardrop Pendant',
    sku: 'NK-2045',
    category: 'Necklaces',
    selling_price: 699,
    cost_price: 280,
    profit: 419,
    profit_margin: 59.94,
    stock: 14,
    low_stock_threshold: 6,
    stock_status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    short_description: 'Faceted natural-look rose quartz crystal suspended on a whisper-thin box chain.',
    detailed_description: 'An ethereal focal piece. Faceted teardrop rose quartz look stone cradled in a three-prong champagne gold setting, suspended from a delicate anti-tarnish cable chain.',
    seo_title: 'Rose Quartz Solitaire Teardrop Necklace | LURELLE',
    meta_description: 'Dainty rose quartz pendant necklace. Minimalist everyday elegance.',
    url_slug: 'rose-quartz-solitaire-pendant',
    is_featured: true,
    is_active: true,
    tags: ['Necklace', 'Rose Quartz', 'Pendant', 'Trending'],
    weight: '9g',
    material: 'Rose Gold Plated Steel, Faceted Simulated Rose Quartz',
    size: 'Chain: 42cm + 5cm extender',
    colour: 'Rose Quartz & Gold',
    collection: 'Petal Whisper'
  },
  {
    id: 4,
    name: 'Seraphina Royal Festive Choker & Earring Suite',
    sku: 'JS-7033',
    category: 'Sets',
    selling_price: 1499,
    cost_price: 650,
    profit: 849,
    profit_margin: 56.64,
    stock: 0,
    low_stock_threshold: 4,
    stock_status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'
    ],
    short_description: 'Intricately arranged floral crystal choker with matching statement drop earrings.',
    detailed_description: 'Show-stopping bridal party suite. Clusters of brilliant marquise cubic zirconia blooming into delicate floral motifs with coordinating dramatic drop earrings.',
    seo_title: 'Seraphina Royal Choker & Earring Set | LURELLE',
    meta_description: 'Complete floral crystal jewellery set for weddings, sangeet, and luxury celebrations.',
    url_slug: 'seraphina-royal-festive-choker-suite',
    is_featured: false,
    is_active: true,
    tags: ['Jewellery Set', 'Choker', 'Party Wear'],
    weight: '52g',
    material: 'Rhodium & Rose Gold Finish Alloy, High-Index Austrian Crystals',
    size: 'Adjustable Dori Choker + 5cm Earrings',
    colour: 'Rose Gold & Clear Crystal',
    collection: 'Royal Heritage'
  },
  {
    id: 5,
    name: 'Lustre Baguette Crystal Eternity Ring',
    sku: 'RG-3012',
    category: 'Rings',
    selling_price: 349,
    cost_price: 140,
    profit: 209,
    profit_margin: 59.89,
    stock: 28,
    low_stock_threshold: 10,
    stock_status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
    ],
    short_description: 'Channel-set rectangular baguette crystals catching radiant light from every angle.',
    detailed_description: 'Modern art deco romance. Seamless channel of flawless baguette-cut cubic zirconia encased in smooth rose-gold electroplated stainless steel.',
    seo_title: 'Baguette Crystal Eternity Ring | LURELLE',
    meta_description: 'Anti-tarnish baguette crystal eternity band. Stackable and waterproof.',
    url_slug: 'baguette-crystal-eternity-ring',
    is_featured: false,
    is_active: true,
    tags: ['Ring', 'Eternity Band', 'Stackable'],
    weight: '4g',
    material: '316L Stainless Steel, PVD Rose Gold, Baguette CZ',
    size: 'Adjustable / US 6-8',
    colour: 'Rose Gold',
    collection: 'Modern Minimalist'
  },
  {
    id: 6,
    name: 'Aurora Tennis Slider Charm Bracelet',
    sku: 'BR-4018',
    category: 'Bracelets',
    selling_price: 599,
    cost_price: 250,
    profit: 349,
    profit_margin: 58.26,
    stock: 16,
    low_stock_threshold: 6,
    stock_status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1611591475819-79b8b738982a?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1611591475819-79b8b738982a?auto=format&fit=crop&w=800&q=80'
    ],
    short_description: 'Continuous ribbon of claw-set crystals with comfortable adjustable bolo toggle.',
    detailed_description: 'Classic tennis glamour reimagined for everyday wear. Continuous row of 2.5mm round brilliant simulated crystals with smooth silicone slider beads for tailored wrist fit.',
    seo_title: 'Aurora Tennis Slider Bracelet | LURELLE',
    meta_description: 'Adjustable crystal tennis bracelet with bolo toggle. Perfect gift.',
    url_slug: 'aurora-tennis-slider-bracelet',
    is_featured: true,
    is_active: true,
    tags: ['Bracelet', 'Tennis Bracelet', 'Bolo Toggle'],
    weight: '11g',
    material: 'Hypoallergenic Brass, 18K Rose Gold Plating, Round CZ',
    size: 'Adjustable up to 22cm wrist',
    colour: 'Rose Gold',
    collection: 'Modern Minimalist'
  },
  {
    id: 7,
    name: 'Opulence Sleek Kada Bangles (Pair)',
    sku: 'BG-5021',
    category: 'Bracelets',
    selling_price: 999,
    cost_price: 410,
    profit: 589,
    profit_margin: 58.96,
    stock: 9,
    low_stock_threshold: 5,
    stock_status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=800&q=80'
    ],
    short_description: 'Duo of minimalist contoured open kada bangles with satin matte rose-gold finish.',
    detailed_description: 'Chic architectural wrists. Two rigid open cuffs designed to stack or wear across both wrists. Finished in a soft satin rose-gold polish that never oxidizes.',
    seo_title: 'Opulence Sleek Kada Bangles Pair | LURELLE',
    meta_description: 'Contoured kada bangles set in rose gold polish. Tarnish-free daily wear.',
    url_slug: 'opulence-sleek-kada-bangles',
    is_featured: false,
    is_active: true,
    tags: ['Bangles', 'Kada', 'Cuff'],
    weight: '34g (pair)',
    material: 'Forged Titanium Steel, Triple Rose Gold Dip',
    size: 'Size 2.4 - 2.6',
    colour: 'Satin Rose Gold',
    collection: 'Royal Heritage'
  },
  {
    id: 8,
    name: 'Celeste Crystal Vine Hairband & Pin Ensemble',
    sku: 'HA-8015',
    category: 'Sets',
    selling_price: 549,
    cost_price: 240,
    profit: 309,
    profit_margin: 56.28,
    stock: 3,
    low_stock_threshold: 5,
    stock_status: 'low_stock',
    image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80'
    ],
    short_description: 'Hand-wired crystal foliage vine with flexible copper wire for effortless hairstyles.',
    detailed_description: 'Romantic bridal and party hair accessory. Intricately twisted soft rose wire adorned with acrylic seed pearls and faceted crystal leaves that bend to weave through braids or buns.',
    seo_title: 'Celeste Crystal Vine Hairband | LURELLE',
    meta_description: 'Romantic crystal vine headpiece for bridal hairstyles and evening wear.',
    url_slug: 'celeste-crystal-vine-hairband',
    is_featured: false,
    is_active: true,
    tags: ['Hair Accessories', 'Vine', 'Headband'],
    weight: '18g',
    material: 'Bendable Copper Wire, Acrylic Seed Pearls, Faceted Crystals',
    size: 'Length: 32 cm flexible',
    colour: 'Rose Gold & Pearls',
    collection: 'Petal Whisper'
  },
  {
    id: 9,
    name: 'Gilded Lotus Floating Rose Pendant',
    sku: 'PD-6019',
    category: 'Pendants',
    selling_price: 449,
    cost_price: 180,
    profit: 269,
    profit_margin: 59.91,
    stock: 19,
    low_stock_threshold: 6,
    stock_status: 'in_stock',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
    ],
    short_description: 'Laser-etched botanical lotus blossom pendant with central champagne crystal accent.',
    detailed_description: 'Symbology of purity and elegance. Detailed dimensional lotus petals micro-set with a central champagne simulated diamond on a mirror-link shimmer chain.',
    seo_title: 'Gilded Lotus Floating Pendant | LURELLE',
    meta_description: 'Lotus botanical pendant in champagne rose gold. Anti-tarnish everyday charm.',
    url_slug: 'gilded-lotus-floating-pendant',
    is_featured: true,
    is_active: true,
    tags: ['Pendants', 'Lotus', 'Champagne Gold'],
    weight: '7g',
    material: 'Stainless Steel, 18K Gold PVD Coating',
    size: 'Pendant: 1.8cm, Chain: 45cm',
    colour: 'Champagne Gold',
    collection: 'Petal Whisper'
  }
];

const initialOrders = [
  {
    id: 'ORD-8942',
    date: '2025-05-18 14:32',
    customer_name: 'Ananya Deshmukh',
    customer_phone: '+91 98402 18942',
    customer_email: 'ananya.d@gmail.com',
    address: 'Flat 4B, Emerald Heights, Shanti Colony',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    items: [
      { id: 1, name: 'Luxe French Baroque Pearl Chandelier Earrings', sku: 'ER-1024', price: 499, quantity: 2, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80', subtotal: 998 },
      { id: 3, name: 'Dainty Rose Quartz Solitaire Teardrop Pendant', sku: 'NK-2045', price: 699, quantity: 1, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80', subtotal: 699 }
    ],
    subtotal: 1697,
    discount: 100,
    shipping: 0,
    tax: 48,
    total: 1645,
    payment_method: 'WhatsApp Pay / UPI',
    payment_status: 'Paid',
    status: 'Processing',
    timeline: [
      { status: 'Order Placed', date: '18 May, 2:32 PM', note: 'Customer initiated via WhatsApp order flow' },
      { status: 'Confirmed', date: '18 May, 2:45 PM', note: 'UPI Payment ₹1,645 verified on WhatsApp' },
      { status: 'Processing', date: '18 May, 3:15 PM', note: 'Gift boxed with premium velvet pouch' }
    ]
  },
  {
    id: 'ORD-8941',
    date: '2025-05-18 11:20',
    customer_name: 'Priyanka Iyer',
    customer_phone: '+91 94451 77319',
    customer_email: 'priyanka.iyer@outlook.com',
    address: '14, 2nd Main Road, Gandhi Nagar, Adyar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600020',
    items: [
      { id: 6, name: 'Aurora Tennis Slider Charm Bracelet', sku: 'BR-4018', price: 599, quantity: 1, image: 'https://images.unsplash.com/photo-1611591475819-79b8b738982a?auto=format&fit=crop&w=200&q=80', subtotal: 599 },
      { id: 5, name: 'Lustre Baguette Crystal Eternity Ring', sku: 'RG-3012', price: 349, quantity: 1, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80', subtotal: 349 }
    ],
    subtotal: 948,
    discount: 0,
    shipping: 79,
    tax: 28,
    total: 1055,
    payment_method: 'WhatsApp Pay / UPI',
    payment_status: 'Paid',
    status: 'Shipped',
    timeline: [
      { status: 'Order Placed', date: '18 May, 11:20 AM', note: 'Direct WhatsApp order' },
      { status: 'Confirmed', date: '18 May, 11:35 AM', note: 'GPay screenshot received' },
      { status: 'Processing', date: '18 May, 12:40 PM', note: 'Packed & labeled' },
      { status: 'Shipped', date: '18 May, 4:10 PM', note: 'Dispatched via BlueDart AWB #9482194' }
    ]
  },
  {
    id: 'ORD-8940',
    date: '2025-05-17 19:12',
    customer_name: 'Kavya Mehra',
    customer_phone: '+91 97112 44321',
    customer_email: 'kavya.m@delhiuni.ac.in',
    address: 'House 88, Vasant Vihar Sector 3',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110057',
    items: [
      { id: 4, name: 'Seraphina Royal Festive Choker & Earring Suite', sku: 'JS-7033', price: 1499, quantity: 1, image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=200&q=80', subtotal: 1499 }
    ],
    subtotal: 1499,
    discount: 150,
    shipping: 0,
    tax: 40,
    total: 1389,
    payment_method: 'Bank Transfer',
    payment_status: 'Paid',
    status: 'Delivered',
    timeline: [
      { status: 'Order Placed', date: '17 May, 7:12 PM', note: 'Order created' },
      { status: 'Confirmed', date: '17 May, 7:30 PM', note: 'IMPS transfer verified' },
      { status: 'Processing', date: '17 May, 8:00 PM', note: 'Quality checked' },
      { status: 'Shipped', date: '18 May, 9:30 AM', note: 'Express Air courier' },
      { status: 'Delivered', date: '18 May, 3:30 PM', note: 'Delivered to recipient with signature' }
    ]
  },
  {
    id: 'ORD-8939',
    date: '2025-05-17 15:45',
    customer_name: 'Sneha Sundaram',
    customer_phone: '+91 98840 92318',
    customer_email: 'sneha.s@tcs.com',
    address: 'Tower 2, Apt 1104, Hiranandani Parks',
    city: 'Chengalpattu',
    state: 'Tamil Nadu',
    pincode: '603002',
    items: [
      { id: 7, name: 'Opulence Sleek Kada Bangles (Pair)', sku: 'BG-5021', price: 999, quantity: 1, image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=200&q=80', subtotal: 999 }
    ],
    subtotal: 999,
    discount: 0,
    shipping: 0,
    tax: 30,
    total: 1029,
    payment_method: 'COD',
    payment_status: 'COD',
    status: 'Pending',
    timeline: [
      { status: 'Order Placed', date: '17 May, 3:45 PM', note: 'Requested Cash On Delivery verification on WhatsApp' }
    ]
  },
  {
    id: 'ORD-8938',
    date: '2025-05-16 18:05',
    customer_name: 'Rhea Kapoor',
    customer_phone: '+91 98201 55678',
    customer_email: 'rhea.kapoor@studio.in',
    address: 'B-12, Pali Hill Road, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    items: [
      { id: 2, name: 'Blush Crystal Celestial Starlight Huggies', sku: 'ER-1025', price: 349, quantity: 2, image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=200&q=80', subtotal: 698 },
      { id: 9, name: 'Gilded Lotus Floating Rose Pendant', sku: 'PD-6019', price: 449, quantity: 1, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80', subtotal: 449 }
    ],
    subtotal: 1147,
    discount: 100,
    shipping: 0,
    tax: 31,
    total: 1078,
    payment_method: 'WhatsApp Pay / UPI',
    payment_status: 'Paid',
    status: 'Delivered',
    timeline: [
      { status: 'Order Placed', date: '16 May, 6:05 PM', note: 'WhatsApp order' },
      { status: 'Confirmed', date: '16 May, 6:20 PM', note: 'Paid' },
      { status: 'Shipped', date: '17 May, 10:00 AM', note: 'Dispatched' },
      { status: 'Delivered', date: '18 May, 1:45 PM', note: 'Delivered' }
    ]
  },
  {
    id: 'ORD-8937',
    date: '2025-05-15 10:14',
    customer_name: 'Tanvi Nair',
    customer_phone: '+91 97401 22891',
    customer_email: 'tanvi.nair@wipro.com',
    address: 'Villa 19, Palm Meadows, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    items: [
      { id: 1, name: 'Luxe French Baroque Pearl Chandelier Earrings', sku: 'ER-1024', price: 499, quantity: 1, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80', subtotal: 499 }
    ],
    subtotal: 499,
    discount: 0,
    shipping: 79,
    tax: 15,
    total: 593,
    payment_method: 'WhatsApp Pay / UPI',
    payment_status: 'Refunded',
    status: 'Cancelled',
    timeline: [
      { status: 'Order Placed', date: '15 May, 10:14 AM', note: 'Placed' },
      { status: 'Cancelled', date: '15 May, 11:30 AM', note: 'Customer requested cancellation before dispatch. UPI refunded immediately.' }
    ]
  }
];

const initialCustomers = [
  {
    id: 'CUST-101',
    name: 'Ananya Deshmukh',
    phone: '+91 98402 18942',
    email: 'ananya.d@gmail.com',
    avatar: 'AD',
    city: 'Chennai',
    state: 'Tamil Nadu',
    total_orders: 5,
    total_spent: 8420,
    last_order_date: '2025-05-18',
    status: 'VIP',
    address: 'Flat 4B, Emerald Heights, Shanti Colony, Anna Nagar',
    orders_history: ['ORD-8942', 'ORD-8712', 'ORD-8519', 'ORD-8302', 'ORD-8114']
  },
  {
    id: 'CUST-102',
    name: 'Priyanka Iyer',
    phone: '+91 94451 77319',
    email: 'priyanka.iyer@outlook.com',
    avatar: 'PI',
    city: 'Chennai',
    state: 'Tamil Nadu',
    total_orders: 3,
    total_spent: 4210,
    last_order_date: '2025-05-18',
    status: 'Active',
    address: '14, 2nd Main Road, Gandhi Nagar, Adyar',
    orders_history: ['ORD-8941', 'ORD-8620', 'ORD-8411']
  },
  {
    id: 'CUST-103',
    name: 'Kavya Mehra',
    phone: '+91 97112 44321',
    email: 'kavya.m@delhiuni.ac.in',
    avatar: 'KM',
    city: 'New Delhi',
    state: 'Delhi',
    total_orders: 4,
    total_spent: 6890,
    last_order_date: '2025-05-17',
    status: 'VIP',
    address: 'House 88, Vasant Vihar Sector 3',
    orders_history: ['ORD-8940', 'ORD-8744', 'ORD-8520', 'ORD-8201']
  },
  {
    id: 'CUST-104',
    name: 'Sneha Sundaram',
    phone: '+91 98840 92318',
    email: 'sneha.s@tcs.com',
    avatar: 'SS',
    city: 'Chengalpattu',
    state: 'Tamil Nadu',
    total_orders: 1,
    total_spent: 1029,
    last_order_date: '2025-05-17',
    status: 'New',
    address: 'Tower 2, Apt 1104, Hiranandani Parks',
    orders_history: ['ORD-8939']
  },
  {
    id: 'CUST-105',
    name: 'Rhea Kapoor',
    phone: '+91 98201 55678',
    email: 'rhea.kapoor@studio.in',
    avatar: 'RK',
    city: 'Mumbai',
    state: 'Maharashtra',
    total_orders: 6,
    total_spent: 11450,
    last_order_date: '2025-05-16',
    status: 'VIP',
    address: 'B-12, Pali Hill Road, Bandra West',
    orders_history: ['ORD-8938', 'ORD-8789', 'ORD-8640', 'ORD-8499', 'ORD-8320', 'ORD-8012']
  },
  {
    id: 'CUST-106',
    name: 'Tanvi Nair',
    phone: '+91 97401 22891',
    email: 'tanvi.nair@wipro.com',
    avatar: 'TN',
    city: 'Bengaluru',
    state: 'Karnataka',
    total_orders: 2,
    total_spent: 2190,
    last_order_date: '2025-05-15',
    status: 'Active',
    address: 'Villa 19, Palm Meadows, Whitefield',
    orders_history: ['ORD-8937', 'ORD-8590']
  }
];

const initialOffers = [
  {
    id: 1,
    name: 'Summer Starlight Sparkle 15%',
    discount_type: 'percentage',
    discount_value: 15,
    start_date: '2025-05-01',
    end_date: '2025-05-31',
    applicable_categories: ['Earrings', 'Necklaces', 'Rings'],
    min_order_value: 999,
    max_discount: 300,
    status: 'Active',
    usage_count: 42
  },
  {
    id: 2,
    name: 'Bridal Party & Suites Flat ₹250 Off',
    discount_type: 'fixed',
    discount_value: 250,
    start_date: '2025-05-10',
    end_date: '2025-06-15',
    applicable_categories: ['Sets', 'Bracelets'],
    min_order_value: 1499,
    max_discount: 250,
    status: 'Active',
    usage_count: 18
  },
  {
    id: 3,
    name: 'Monsoon Monsoon Preview 20%',
    discount_type: 'percentage',
    discount_value: 20,
    start_date: '2025-06-01',
    end_date: '2025-06-30',
    applicable_categories: ['All'],
    min_order_value: 1299,
    max_discount: 400,
    status: 'Scheduled',
    usage_count: 0
  },
  {
    id: 4,
    name: 'Spring Welcome Offer ₹100 Off',
    discount_type: 'fixed',
    discount_value: 100,
    start_date: '2025-04-01',
    end_date: '2025-04-30',
    applicable_categories: ['All'],
    min_order_value: 699,
    max_discount: 100,
    status: 'Expired',
    usage_count: 94
  }
];

const initialWebsiteSettings = {
  shop_name: 'LURELLE',
  tagline: 'Jewellery That Tells Your Story',
  boutique_name: 'LURELLE Fancy Jewellery Boutique',
  logo_text: 'LURELLE',
  hero_title: 'Jewellery That Tells Your Story',
  hero_subtitle: 'Elegant, affordable and uniquely you.',
  whatsapp_number: '+919876543210',
  phone_number: '+91 98765 43210',
  email: 'concierge@lurelle.in',
  instagram_url: 'https://instagram.com/lurelle.jewels',
  address: 'Suite 402, Rosewood Avenue, Anna Nagar, Chennai, Tamil Nadu 600040',
  opening_hours: 'Mon - Sat: 10:30 AM – 8:30 PM | Sun: 11:00 AM – 7:00 PM',
  upi_id: 'lurelle.jewels@okhdfcbank',
  standard_shipping: 79,
  free_shipping_min: 999,
  tax_rate_percent: 3,
  about_philosophy: 'Anti-tarnish, lightweight, hypoallergenic fancy jewellery curated for girls and women who celebrate everyday grace without exorbitant markups.',
  about_quality: 'Premium cubic zirconia, baroque faux pearls, skin-friendly nickel-free base metals, and durable vacuum plating designed to retain brilliance.'
};

const initialAdminSettings = {
  owner_name: 'Gokul (Boutique Director)',
  owner_email: 'director@lurelle.in',
  role: 'Owner & Chief Curator',
  avatar_initials: 'LU',
  phone: '+91 98765 43210',
  whatsapp_status: 'Connected',
  whatsapp_last_sync: 'Active sync (2m ago)',
  email_notifications: true,
  whatsapp_order_alerts: true,
  low_stock_alerts: true,
  daily_digest: true
};

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [offers, setOffers] = useState(initialOffers);
  const [websiteSettings, setWebsiteSettings] = useState(initialWebsiteSettings);
  const [adminSettings, setAdminSettings] = useState(initialAdminSettings);

  // Active view navigation: 'dashboard' | 'products' | 'orders' | 'customers' | 'analytics' | 'offers' | 'settings' | 'admin-settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New WhatsApp Order Received', message: 'Ananya Deshmukh ordered Baroque Pearl Earrings (ORD-8942)', time: '12m ago', read: false, type: 'order' },
    { id: 2, title: 'Low Stock Alert', message: 'Blush Crystal Celestial Huggies has only 5 units remaining.', time: '1h ago', read: false, type: 'stock' },
    { id: 3, title: 'Daily Revenue Target Met ✨', message: 'Today\'s sales crossed ₹12,000 via WhatsApp confirmations.', time: '3h ago', read: true, type: 'revenue' },
    { id: 4, title: 'Product Out of Stock', message: 'Seraphina Royal Festive Choker Suite is now sold out.', time: '5h ago', read: true, type: 'alert' }
  ]);

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Product Actions
  const addProduct = (newProduct) => {
    const sellPrice = Number(newProduct.selling_price) || 0;
    const costPrice = Number(newProduct.cost_price) || 0;
    const profit = sellPrice - costPrice;
    const profit_margin = sellPrice > 0 ? Number(((profit / sellPrice) * 100).toFixed(2)) : 0;
    const stock = Number(newProduct.stock) || 0;
    const lowStockThreshold = Number(newProduct.low_stock_threshold) || 8;
    
    let stock_status = 'in_stock';
    if (stock <= 0) stock_status = 'out_of_stock';
    else if (stock <= lowStockThreshold) stock_status = 'low_stock';

    const item = {
      ...newProduct,
      id: Date.now(),
      selling_price: sellPrice,
      cost_price: costPrice,
      profit,
      profit_margin,
      stock,
      low_stock_threshold: lowStockThreshold,
      stock_status,
      sku: newProduct.sku || `JW-${Math.floor(1000 + Math.random() * 9000)}`,
      image: newProduct.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      images: newProduct.images?.length > 0 ? newProduct.images : [newProduct.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'],
      is_featured: !!newProduct.is_featured,
      is_active: newProduct.is_active !== undefined ? newProduct.is_active : true
    };

    setProducts(prev => [item, ...prev]);
    showToast(`Product "${item.name}" created successfully!`, 'success');
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const sellPrice = updatedFields.selling_price !== undefined ? Number(updatedFields.selling_price) : p.selling_price;
      const costPrice = updatedFields.cost_price !== undefined ? Number(updatedFields.cost_price) : p.cost_price;
      const profit = sellPrice - costPrice;
      const profit_margin = sellPrice > 0 ? Number(((profit / sellPrice) * 100).toFixed(2)) : 0;
      const stock = updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock;
      const lowStockThreshold = updatedFields.low_stock_threshold !== undefined ? Number(updatedFields.low_stock_threshold) : p.low_stock_threshold;
      
      let stock_status = 'in_stock';
      if (stock <= 0) stock_status = 'out_of_stock';
      else if (stock <= lowStockThreshold) stock_status = 'low_stock';

      return {
        ...p,
        ...updatedFields,
        selling_price: sellPrice,
        cost_price: costPrice,
        profit,
        profit_margin,
        stock,
        low_stock_threshold: lowStockThreshold,
        stock_status
      };
    }));
    showToast('Product details updated successfully!', 'success');
  };

  const deleteProduct = (id) => {
    const item = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(`Product "${item?.name || 'Item'}" deleted.`, 'info');
  };

  const duplicateProduct = (id) => {
    const original = products.find(p => p.id === id);
    if (!original) return;
    const duplicated = {
      ...original,
      id: Date.now(),
      name: `${original.name} (Copy)`,
      sku: `${original.sku}-CPY`,
      stock: original.stock,
      stock_status: original.stock_status
    };
    setProducts(prev => [duplicated, ...prev]);
    showToast(`Duplicated "${original.name}" successfully!`, 'success');
  };

  // Order Actions
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      const nowStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      return {
        ...ord,
        status: newStatus,
        timeline: [...ord.timeline, { status: newStatus, date: nowStr, note: `Status updated to ${newStatus} by owner` }]
      };
    }));
    showToast(`Order ${orderId} status changed to ${newStatus}`, 'success');
  };

  const updateOrderPaymentStatus = (orderId, newPaymentStatus) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      return { ...ord, payment_status: newPaymentStatus };
    }));
    showToast(`Payment status for ${orderId} updated to ${newPaymentStatus}`, 'success');
  };

  // Offer Actions
  const addOffer = (newOffer) => {
    const offer = {
      ...newOffer,
      id: Date.now(),
      usage_count: 0
    };
    setOffers(prev => [offer, ...prev]);
    showToast(`Offer "${offer.name}" created!`, 'success');
  };

  const updateOffer = (id, updatedFields) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...updatedFields } : o));
    showToast('Promotion offer updated successfully!', 'success');
  };

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    showToast('Offer deleted from store promotions.', 'info');
  };

  const toggleOfferStatus = (id) => {
    setOffers(prev => prev.map(o => {
      if (o.id !== id) return o;
      const nextStatus = o.status === 'Active' ? 'Expired' : 'Active';
      return { ...o, status: nextStatus };
    }));
    showToast('Offer status toggled.', 'info');
  };

  // Notification Actions
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Update Settings
  const updateWebsite = (newValues) => {
    setWebsiteSettings(prev => ({ ...prev, ...newValues }));
    showToast('Website boutique settings saved successfully!', 'success');
  };

  const updateAdmin = (newValues) => {
    setAdminSettings(prev => ({ ...prev, ...newValues }));
    showToast('Admin profile & security preferences saved!', 'success');
  };

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        orders,
        updateOrderStatus,
        updateOrderPaymentStatus,
        customers,
        offers,
        addOffer,
        updateOffer,
        deleteOffer,
        toggleOfferStatus,
        websiteSettings,
        updateWebsite,
        adminSettings,
        updateAdmin,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
