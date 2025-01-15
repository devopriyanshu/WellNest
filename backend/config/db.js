import pkg from "pg"; // Use default import for CommonJS module
const { Pool } = pkg;

import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: "mental_health_app",
  password: "psqlsun",
  port: 5433,
});

// const query = async (text, params) => {
//   const res = await pool.query(text, params); // Execute query
//   return res;
// };

// Export the query function for use in other files
// module.exports = {
//   query,
// };

export default pool;
