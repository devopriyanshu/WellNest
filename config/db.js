import pkg from "pg"; // Use default import for CommonJS module
const { Pool } = pkg;

import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
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
