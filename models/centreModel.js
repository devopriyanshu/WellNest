import pool from "../config/db.js";

export const registerCenterModel = async (
  centerData,
  imageUrls = [],
  centerImageUrl
) => {
  const {
    name,
    category,
    description,
    address,
    latitude,
    longitude,
    phone,
    email,
    website,
    offers,
    amenities,
    equipment,
    services,
    trainers,
    pricingData,
    schedule,
  } = centerData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert into centers table
    const centerRes = await client.query(
      `INSERT INTO centers (name, category, description, address,latitude, longitude, phone, email, website, offers, center_image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9, $10, $11)
           RETURNING id`,
      [
        name,
        category,
        description,
        address,
        latitude,
        longitude,
        phone,
        email,
        website,
        offers,
        centerImageUrl,
      ]
    );

    const centerId = centerRes.rows[0].id;

    // Insert into center_amenities
    for (const item of amenities) {
      if (item.value)
        await client.query(
          `INSERT INTO center_amenities (center_id, value) VALUES ($1, $2)`,
          [centerId, item.value]
        );
    }

    // Insert into center_equipment
    for (const item of equipment) {
      if (item.value)
        await client.query(
          `INSERT INTO center_equipment (center_id, value) VALUES ($1, $2)`,
          [centerId, item.value]
        );
    }

    // Insert into center_services
    for (const item of services) {
      if (item.name)
        await client.query(
          `INSERT INTO center_services (center_id, name, icon, description) VALUES ($1, $2, $3, $4)`,
          [centerId, item.name, item.icon, item.description]
        );
    }

    // Insert into center_trainers
    for (const trainer of trainers) {
      if (trainer.name)
        await client.query(
          `INSERT INTO center_trainers (center_id, name, specialty, bio, image)
               VALUES ($1, $2, $3, $4, $5)`,
          [
            centerId,
            trainer.name,
            trainer.specialty,
            trainer.bio,
            trainer.image,
          ]
        );
    }

    // Insert into center_pricing
    const pricing = [
      { type: "monthly", price: pricingData.monthly },
      { type: "annual", price: pricingData.annual },
      { type: "dayPass", price: pricingData.dayPass },
      { type: "classPackages", price: pricingData.classPackages },
      { type: "personalTraining", price: pricingData.personalTraining },
    ];
    for (const item of pricing) {
      if (item.price)
        await client.query(
          `INSERT INTO center_pricing (center_id, type, price) VALUES ($1, $2, $3)`,
          [centerId, item.type, item.price]
        );
    }

    // Insert schedule
    let parsedSchedule = schedule;

    // If schedule is coming as a JSON string, parse it
    if (typeof schedule === "string") {
      try {
        parsedSchedule = JSON.parse(schedule);
      } catch (err) {
        console.error("Invalid schedule JSON:", schedule);
        throw err;
      }
    }

    for (const item of parsedSchedule) {
      console.log("Inserting:", item);
      await client.query(
        `INSERT INTO center_schedule (center_id, day_of_week, is_open, opening_time, closing_time)
       VALUES ($1, $2, $3, $4, $5)`,
        [
          centerId,
          item.day,
          item.isOpen,
          item.openingTime || null,
          item.closingTime || null,
        ]
      );
    }

    //insert images
    for (const url of imageUrls) {
      await client.query(
        `INSERT INTO center_images (center_id, image_url) VALUES ($1, $2)`,
        [centerId, url]
      );
    }

    await client.query("COMMIT");
    return { success: true, centerId };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const findCenterById = async (centerId) => {
  const result = await pool.query("SELECT * FROM centers WHERE id = $1", [
    centerId,
  ]);
  return result.rows[0];
};

export const findCenterByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM centers WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

export const listCenterModel = async (filters = {}, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const today = new Date();
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = weekdays[today.getDay()];

  let query = `
    SELECT c.id, c.name, c.category, c.description, c.address, c.center_image
    FROM centers c
  `;

  const values = [];
  const conditions = [];

  // Filter: category
  console.log(filters.category);

  if (filters.category) {
    values.push(filters.category);
    conditions.push(`c.category ILIKE $${values.length}`);
  }

  // Filter: city or address (since address is a text field)
  if (filters.city) {
    values.push(`%${filters.city}%`);
    conditions.push(`c.address ILIKE $${values.length}`);
  }

  // Search: match name, category, or address
  if (filters.search) {
    const keyword = `%${filters.search}%`;
    values.push(keyword); // name
    values.push(keyword); // category
    values.push(keyword); // address
    conditions.push(
      `(c.name ILIKE $${values.length - 2} OR c.category ILIKE $${
        values.length - 1
      } OR c.address ILIKE $${values.length})`
    );
  }

  if (conditions.length > 0) {
    query += `WHERE ${conditions.join(" AND ")} `;
  }

  values.push(limit);
  values.push(offset);
  query += `ORDER BY c.id DESC LIMIT $${values.length - 1} OFFSET $${
    values.length
  }`;

  const centers = await pool.query(query, values);

  const results = [];

  for (const center of centers.rows) {
    const [amenitiesRes, pricingRes, scheduleRes] = await Promise.all([
      pool.query(`SELECT value FROM center_amenities WHERE center_id = $1`, [
        center.id,
      ]),
      pool.query(
        `SELECT price FROM center_pricing WHERE center_id = $1 AND type = 'monthly'`,
        [center.id]
      ),
      pool.query(
        `SELECT opening_time, closing_time 
         FROM center_schedule 
         WHERE center_id = $1 AND is_open = true AND day_of_week = $2 
         ORDER BY opening_time ASC 
         LIMIT 1`,
        [center.id, todayName]
      ),
    ]);

    const price = pricingRes.rows.length > 0 ? pricingRes.rows[0].price : "";

    const openHours = scheduleRes.rows.length
      ? `${scheduleRes.rows[0].opening_time} - ${scheduleRes.rows[0].closing_time}`
      : "Unavailable";

    results.push({
      id: center.id,
      name: center.name,
      category: center.category,
      rating: 5,
      reviewCount: 100,
      location: center.address || "",
      distance: null,
      image: center.center_image,
      description: center.description,
      amenities: amenitiesRes.rows.map((r) => r.value),
      prices: price,
      openHours,
    });
  }

  return results;
};

// Get full center details by ID
export const getCenterDetailByIdModel = async (centerId) => {
  const centerRes = await pool.query(`SELECT * FROM centers WHERE id = $1`, [
    centerId,
  ]);
  if (centerRes.rows.length === 0) return null;

  const [images, amenities, equipment, services, trainers, pricing, schedule] =
    await Promise.all([
      pool.query(`SELECT image_url FROM center_images WHERE center_id =$1`, [
        centerId,
      ]),
      pool.query(`SELECT value FROM center_amenities WHERE center_id = $1`, [
        centerId,
      ]),

      pool.query(`SELECT value FROM center_equipment WHERE center_id = $1`, [
        centerId,
      ]),
      pool.query(
        `SELECT name, icon, description FROM center_services WHERE center_id = $1`,
        [centerId]
      ),
      pool.query(
        `SELECT name, specialty, bio, image FROM center_trainers WHERE center_id = $1`,
        [centerId]
      ),
      pool.query(
        `SELECT type, price FROM center_pricing WHERE center_id = $1`,
        [centerId]
      ),
      pool.query(
        `SELECT day_of_week, is_open, opening_time, closing_time FROM center_schedule WHERE center_id = $1`,
        [centerId]
      ),
    ]);

  return {
    ...centerRes.rows[0],
    images: images.rows,
    amenities: amenities.rows,
    equipment: equipment.rows,
    services: services.rows,
    trainers: trainers.rows,
    pricing: pricing.rows,
    schedule: schedule.rows,
  };
};

// Update center basic info only (extend this later as needed)
export const updateCenterByIdModel = async (centerId, updateData) => {
  const { name, category, description, phone, email, website, offers } =
    updateData;

  const result = await pool.query(
    `UPDATE centers SET name = $1, category = $2, description = $3,
     phone = $4, email = $5, website = $6, offers = $7
     WHERE id = $8 RETURNING *`,
    [name, category, description, phone, email, website, offers, centerId]
  );

  return result.rows[0];
};
