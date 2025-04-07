import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};
export const findUserById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};
export const createUser = async (name, email, password) => {
  const result = await pool.query(
    "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, email",
    [name, email, password]
  );
  return result.rows[0];
};
export const updateUserModel = async (id, data) => {
  const {
    full_name,
    email,
    phone_number,
    gender,
    dob,
    profile_picture,
    address,
    language_preference,
  } = data;

  const query = `
  UPDATE users SET
    full_name = $1,
    email = $2,
    phone_number = $3,
    gender = $4,
    dob = $5,
    profile_picture = $6,
    address = $7,
    language_preference = $8,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = $9
    RETURNING id, full_name, email, phone_number, gender, dob, profile_picture, address, language_preference, updated_at
  `;

  const values = [
    full_name,
    email,
    phone_number,
    gender,
    dob,
    profile_picture,
    address,
    language_preference,
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
