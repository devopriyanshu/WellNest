import pool from "../config/db.js";

export const registerExpertModel = async (data) => {
  const {
    name,
    email,
    phone,
    specialization,
    experience,
    bio,
    profile_image,
    availability,
    qualifications,
    expertise_area,
    languages,
    bg_image,
    faqs,
  } = data;

  const query = `INSERT INTO experts (
      name, email, phone, specialization, experience, bio,
      profile_image, availability, qualifications,
      expertise_area, languages, bg_image, faqs,
      created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9,
      $10, $11, $12, $13,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING *`;

  const values = [
    name,
    email,
    phone,
    specialization,
    experience,
    bio,
    profile_image,
    JSON.stringify(availability), // ✅
    JSON.stringify(qualifications), // ✅
    JSON.stringify(expertise_area), // ✅
    languages,
    bg_image,
    JSON.stringify(faqs), // ✅
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findExpertByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM experts WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};
