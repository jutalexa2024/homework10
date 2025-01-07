
//understand this
import pkg from 'pg';
const { Pool } = pkg;

import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

});

pool.on('connect', () => {
  console.log('Successfully connected to the database.');
});

// Log errors in the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
  process.exit(-1); // Exit the process in case of a critical error
});


export default pool;
