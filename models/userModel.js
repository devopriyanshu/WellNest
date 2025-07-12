import pool from "../config/db.js";

export const findUsersByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};
export const findUsersById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    id,
  ]);
  return result.rows[0];
};
export const createUserEntry = async (email) => {
  const result = await pool.query(
    "INSERT INTO users ( email) VALUES ($1) RETURNING id, email",
    [email]
  );
  return result.rows[0];
};

export const updateUsersModel = async (id, data) => {
  const {
    full_name,
    email,
    phone_number,
    gender,
    dob,
    profile_picture,
    address, // full address string
    language_preference,
    height,
    weight,
  } = data;

  console.log("[updateUsersModel] Received data:", data);

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
      height = $9,
      weight = $10,
      
      
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $11
    RETURNING id, full_name, email, phone_number, gender, dob, profile_picture, address, language_preference, height, weight, updated_at
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
    height ? parseFloat(height) : null,
    weight ? parseFloat(weight) : null,

    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
