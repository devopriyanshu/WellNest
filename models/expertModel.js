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

export const updateExpertInfo = async (id, data) => {
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

  const query = `
  UPDATE experts SET 
    name = $1,
    email = $2,
    phone = $3,
    specialization = $4,
    experience = $5,
    bio = $6,
    profile_image = $7,
    availability = $8,
    qualifications = $9,
    expertise_area = $10,
    languages = $11,
    bg_image = $12,
    faqs = $13,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $14
  RETURNING *;
`;

  const values = [
    name,
    email,
    phone,
    specialization,
    experience,
    bio,
    profile_image,
    JSON.stringify(availability),
    JSON.stringify(qualifications),
    JSON.stringify(expertise_area),
    languages,
    bg_image,
    JSON.stringify(faqs),
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findExpertById = async (id) => {
  const result = await pool.query("SELECT * FROM experts WHERE id = $1", [id]);
  return result.rows[0];
};
