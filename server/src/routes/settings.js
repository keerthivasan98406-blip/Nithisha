const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Public: Get all website settings as key-value map
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM website_settings').all();
    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update website settings
router.put('/', authenticateToken, (req, res) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Valid settings object is required' });
    }

    const upsert = db.prepare(`
      INSERT INTO website_settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    const runBatch = db.transaction((settingsObj) => {
      for (const [key, value] of Object.entries(settingsObj)) {
        if (value !== undefined && value !== null) {
          upsert.run(key, String(value));
        }
      }
    });

    runBatch(updates);

    const rows = db.prepare('SELECT key, value FROM website_settings').all();
    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    res.json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
