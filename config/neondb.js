import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon DB requires SSL in production, but we can disable for local dev
  ssl: process.env.DATABASE_URL?.includes('neon.tech') 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Catch unhandled errors on idle clients so the app doesn't crash
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
