// const { Pool } = require('pg');
// const dotenv = require('dotenv');
// dotenv.config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: Number(process.env.DB_PORT || 5432),
//   max: 10,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000
// });

// pool.on('error', (err) => {
//   console.error('Unexpected error', err);
//   process.exit(-1);
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
//   pool
// };


// src/db.js
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: process.env.DB_USER || 'ranusau',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'budgetmate_db',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || 'yourpassword',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  ssl: isProduction ? false : false, 
});

module.exports = pool;
