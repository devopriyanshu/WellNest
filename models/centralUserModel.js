import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT id, email, role FROM central_users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

export const findCentralUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, email, role FROM central_users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const createUser = async (name, email, password, role, provider) => {
  const result = await pool.query(
    "INSERT INTO central_users (name, email, password, role, provider) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role",
    [name, email, password || null, role, provider]
  );
  return result.rows[0];
};

// export const updateUserModel = async (id, data) => {
//   const {
//     full_name,
//     email,
//     phone_number,
//     gender,
//     dob,
//     profile_picture,
//     address,
//     language_preference,
//   } = data;

//   const query = `
//   UPDATE users SET
//     full_name = $1,
//     email = $2,
//     phone_number = $3,
//     gender = $4,
//     dob = $5,
//     profile_picture = $6,
//     address = $7,
//     language_preference = $8,
//     updated_at = CURRENT_TIMESTAMP
//     WHERE id = $9
//     RETURNING id, full_name, email, phone_number, gender, dob, profile_picture, address, language_preference, updated_at
//   `;

//   const values = [
//     full_name,
//     email,
//     phone_number,
//     gender,
//     dob,
//     profile_picture,
//     address,
//     language_preference,
//     id,
//   ];

//   const result = await pool.query(query, values);
//   return result.rows[0];
// };
