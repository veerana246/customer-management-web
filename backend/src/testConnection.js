require('dotenv').config();
const db = require('./db');

(async () => {
  try {
    const { rows } = await db.query('SELECT 1');
    console.log('Connection OK:', rows);
  } catch (err) {
    console.error('Connection failed:', err);
  }
})();
