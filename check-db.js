const Database = require('./server/node_modules/better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'server', 'data', 'lurelle.db'));

const rows = db.prepare('SELECT key, value FROM website_settings').all();
for (const row of rows) {
  console.log(row.key + ' = ' + row.value);
}

db.close();
