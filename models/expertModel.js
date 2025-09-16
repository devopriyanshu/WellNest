import pool from "../config/db.js";

export const registerExpertModel = async (
  data,
  profilePicUrl,
  backgroundImageUrl
) => {
  const contact = data.contact;

  const {
    name,
    category,
    experience,
    bio,
    languages,
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
      profilePicUrl,
      backgroundImageUrl,
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
export const getExpertById = async (id) => {
  const expert = await pool.query(`SELECT * FROM experts WHERE id = $1`, [id]);
  const schedules = await pool.query(
    `SELECT day, selected , start_time, end_time FROM expert_availability WHERE expert_id = $1`,
    [id]
  );
  const qualifications = await pool.query(
    `SELECT value FROM expert_qualifications WHERE expert_id = $1`,
    [id]
  );
  const specialties = await pool.query(
    `SELECT value FROM expert_specialties WHERE expert_id = $1`,
    [id]
  );
  const services = await pool.query(
    `SELECT * FROM expert_services WHERE expert_id = $1`,
    [id]
  );

  const faq = await pool.query(
    `SELECT * FROM expert_faqs WHERE expert_id = $1`,
    [id]
  );

  return {
    ...expert.rows[0],
    schedules: schedules.rows,
    qualifications: qualifications.rows,
    specialties: specialties.rows,
    services: services.rows,
    faq: faq.rows,
  };
};

const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Converts "monday" to "Mon"
function toShortDay(day) {
  const map = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  };
  return map[day.toLowerCase()] || "";
}

function getFormattedAvailability(rawDays) {
  const days = rawDays.map(toShortDay).filter(Boolean);

  const sortedDays = dayOrder.filter((day) => days.includes(day));

  const result = [];
  let start = null;

  for (let i = 0; i < sortedDays.length; i++) {
    if (start === null) start = sortedDays[i];

    const currentDay = sortedDays[i];
    const nextDay = sortedDays[i + 1];
    const currentIndex = dayOrder.indexOf(currentDay);
    const expectedNext = dayOrder[currentIndex + 1];

    if (nextDay !== expectedNext) {
      result.push(start === currentDay ? currentDay : `${start}-${currentDay}`);
      start = null;
    }
  }

  const formatted = result.join(", ");
  return formatted;
}

export const listExpertModel = async (filters = {}, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const values = [];
  const conditions = [];

  let query = `
    SELECT DISTINCT e.id, e.name, e.category, e.profile_image, e.experience
    FROM experts e
    LEFT JOIN expert_specialties es ON es.expert_id = e.id
  `;

  // Filter by category
  if (filters.category) {
    values.push(`%${filters.category}%`);
    conditions.push(`e.category ILIKE $${values.length}`);
  }

  // Search by name, category, or specialty
  if (filters.search) {
    const keyword = `%${filters.search}%`;
    values.push(keyword, keyword, keyword);
    conditions.push(`
      (
        e.name ILIKE $${values.length - 2} OR
        e.category ILIKE $${values.length - 1} OR
        es.value ILIKE $${values.length}
      )
    `);
  }

  // Apply WHERE clause if conditions exist
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")} `;
  }

  // Sorting
  let sortField = "e.id";
  if (filters.sortBy === "experience") {
    sortField = "e.experience";
  } else if (filters.sortBy === "rating") {
    sortField = "e.rating"; // Assuming you’ll add this field
  }

  values.push(limit, offset);
  query += ` ORDER BY ${sortField} DESC LIMIT $${values.length - 1} OFFSET $${
    values.length
  }`;

  const experts = await pool.query(query, values);
  const results = [];

  for (const expert of experts.rows) {
    const [formatRes, availabilityRes, specialtiesRes] = await Promise.all([
      pool.query(
        `SELECT array_agg(DISTINCT format) AS formats FROM expert_services WHERE expert_id = $1`,
        [expert.id]
      ),
      pool.query(
        `SELECT day FROM expert_availability WHERE expert_id = $1 AND selected = true`,
        [expert.id]
      ),
      pool.query(
        `SELECT array_agg(DISTINCT value) AS specialties FROM expert_specialties WHERE expert_id = $1`,
        [expert.id]
      ),
    ]);

    const formats = formatRes.rows[0]?.formats || [];
    const days = availabilityRes.rows.map((r) => r.day);

    const specialties = specialtiesRes.rows[0]?.specialties || [];

    results.push({
      id: expert.id,
      name: expert.name,
      category: expert.category,
      rating: 5,
      reviewCount: 100,
      location: formats.join(" & ") || "Unknown",
      experience: expert.experience,
      image: expert.profile_image || "/api/placeholder/600/400",
      description: `Specialist in ${specialties.join(", ")}`,
      availability: getFormattedAvailability(days),
      formats,
      specialties,
    });
  }

  return results;
};
