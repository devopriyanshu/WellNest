import pool from "../config/db";

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM USER WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};
export const findUserById = async (id) => {
  const result = await pool.query("SELECT * FROM USER WHERE id = $1", [id]);
  return result.rows[0];
};
export const createUser = async (full_name, email, password) => {
  const result = await pool.query(
    "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, email",
    [full_name, email, password]
  );
  return result.rows[0];
};
