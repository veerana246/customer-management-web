const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.COCKROACH_CONN_STR,
  ssl: { rejectUnauthorized: true }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
