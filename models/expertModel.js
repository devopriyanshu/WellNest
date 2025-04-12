import pool from "../config/db.js";

export const registerExpertModel = async (data) => {
  const {
    name,
    category,
    experience,
    bio,
    languages,
    profilePic,
    backgroundImage,
    contact,
    qualifications,
    specialties,
    services,
    availability,
    faq,
  } = data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert into experts table
    const expertInsertQuery = `
      INSERT INTO experts (
        name, category, experience, bio, languages,
        profile_image, bg_image,
        phone, email, website, location
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING id
    `;

    const expertValues = [
      name,
      category,
      experience,
      bio,
      languages,
      profilePic,
      backgroundImage,
      contact.phone,
      contact.email,
      contact.website,
      contact.location,
    ];

    const { rows } = await client.query(expertInsertQuery, expertValues);
    const expertId = rows[0].id;

    // Insert qualifications
    for (const qual of qualifications) {
      await client.query(
        `INSERT INTO expert_qualifications (expert_id, value) VALUES ($1, $2)`,
        [expertId, qual.value]
      );
    }

    // Insert specialties
    for (const spec of specialties) {
      await client.query(
        `INSERT INTO expert_specialties (expert_id, value) VALUES ($1, $2)`,
        [expertId, spec.value]
      );
    }

    // Insert services
    for (const service of services) {
      await client.query(
        `INSERT INTO expert_services (expert_id, name, format, duration, price) VALUES ($1, $2, $3, $4, $5)`,
        [
          expertId,
          service.name,
          service.format,
          service.duration,
          service.price,
        ]
      );
    }

    // Insert availability
    for (const day in availability) {
      const { selected, startTime, endTime } = availability[day];
      await client.query(
        `INSERT INTO expert_availability (expert_id, day, selected, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5)`,
        [expertId, day, selected, startTime, endTime]
      );
    }

    // Insert FAQs
    for (const item of faq) {
      await client.query(
        `INSERT INTO expert_faqs (expert_id, question, answer) VALUES ($1, $2, $3)`,
        [expertId, item.question, item.answer]
      );
    }

    await client.query("COMMIT");
    return { id: expertId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const findExpertByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM experts WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

export const updateExpertModel = async (id, data) => {
  const {
    name,
    category,
    experience,
    bio,
    languages,
    profilePic,
    backgroundImage,
    contact,
    qualifications,
    specialties,
    services,
    availability,
    faq,
  } = data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update main expert details
    const updateExpertQuery = `
      UPDATE experts SET
        name = $1,
        category = $2,
        experience = $3,
        bio = $4,
        languages = $5,
        profile_image = $6,
        bg_image = $7,
        phone = $8,
        email = $9,
        website = $10,
        location = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
    `;
    const expertValues = [
      name,
      category,
      experience,
      bio,
      languages,
      profilePic,
      backgroundImage,
      contact.phone,
      contact.email,
      contact.website,
      contact.location,
      id,
    ];
    await client.query(updateExpertQuery, expertValues);

    // Clear old associated data
    await client.query(
      `DELETE FROM expert_qualifications WHERE expert_id = $1`,
      [id]
    );
    await client.query(`DELETE FROM expert_specialties WHERE expert_id = $1`, [
      id,
    ]);
    await client.query(`DELETE FROM expert_services WHERE expert_id = $1`, [
      id,
    ]);
    await client.query(`DELETE FROM expert_availability WHERE expert_id = $1`, [
      id,
    ]);
    await client.query(`DELETE FROM expert_faqs WHERE expert_id = $1`, [id]);

    // Re-insert updated values

    for (const qual of qualifications) {
      await client.query(
        `INSERT INTO expert_qualifications (expert_id, value) VALUES ($1, $2)`,
        [id, qual.value]
      );
    }

    for (const spec of specialties) {
      await client.query(
        `INSERT INTO expert_specialties (expert_id, value) VALUES ($1, $2)`,
        [id, spec.value]
      );
    }

    for (const service of services) {
      await client.query(
        `INSERT INTO expert_services (expert_id, name, format, duration, price) VALUES ($1, $2, $3, $4, $5)`,
        [id, service.name, service.format, service.duration, service.price]
      );
    }

    for (const day in availability) {
      const { selected, startTime, endTime } = availability[day];
      await client.query(
        `INSERT INTO expert_availability (expert_id, day, selected, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, day, selected, startTime, endTime]
      );
    }

    for (const item of faq) {
      await client.query(
        `INSERT INTO expert_faqs (expert_id, question, answer) VALUES ($1, $2, $3)`,
        [id, item.question, item.answer]
      );
    }

    await client.query("COMMIT");
    return { message: "Expert updated successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const findExpertById = async (id) => {
  const result = await pool.query("SELECT * FROM experts WHERE id = $1", [id]);
  return result.rows[0];
};
