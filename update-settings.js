// Run this from: C:\Users\Keerthivasan.A\Downloads\lurelle-jewellery\lurelle-jewellery
// Command: node update-settings.js

const Database = require('./server/node_modules/better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'server', 'data', 'lurelle.db'));

const updates = [
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
  ['about_story', 'Founded with a passion for modern elegance, Nithisha Collection brings you premium, runway-inspired fashion jewellery without luxury markups.']
];

const stmt = db.prepare('INSERT OR REPLACE INTO website_settings (key, value) VALUES (?, ?)');

for (const [key, value] of updates) {
  stmt.run(key, value);
  console.log('Updated: ' + key);
}

db.close();
console.log('\nDone! Restart start.bat now.');
