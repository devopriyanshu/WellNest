import pool from "../config/db.js";

export const registerCenterModel = async (centerData) => {
  const {
    name,
    category,
    description,
    address,
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
      `INSERT INTO centers (name, category, description, address, phone, email, website, offers)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id`,
      [name, category, description, address, phone, email, website, offers]
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
    for (const item of schedule) {
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

export const listCenterModel = async (page = 1, limit = 10) => {
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

  const cenetersQuery = `SELECT  id, name , category , description FROM centers ORDER BY id DESC LIMIT $1 OFFSET $2`;

  const centers = await pool.query(cenetersQuery, [limit, offset]);

  const results = [];

  for (const center of centers.rows) {
    const [amenitiesRes, pricingRes, scheduleRes, addressRes] =
      await Promise.all([
        pool.query(`SELECT value FROM center_amenities WHERE center_id = $1`, [
          center.id,
        ]),
        pool.query(
          `SELECT price FROM center_pricing WHERE center_id = $1 AND type = 'monthly'`,
          [center.id]
        ),
        pool.query(
          `SELECT opening_time, closing_time FROM center_schedule WHERE center_id = $1 AND is_open = true AND day_of_week = $2 ORDER BY opening_time ASC
        LIMIT 1`,
          [center.id, todayName]
        ),
        pool.query(
          `SELECT address_line, city FROM center_addresses WHERE center_id = $1`,
          [center.id]
        ),
      ]);
    let address = "";
    if (addressRes.rows.length > 0) {
      const { address_line, city } = addressRes.rows[0];
      address = `${address_line}, ${city}`;
    }
    let price = "";
    if (pricingRes.rows[0] > 0) {
      price = pricingRes.rows[0].price;
    }

    const openHours = scheduleRes.rows.length
      ? `${scheduleRes.rows[0].opening_time} - ${scheduleRes.rows[0].closing_time}`
      : "Unavailable";
    results.push({
      id: center.id,
      name: center.name,
      category: center.category,
      rating: 0, // placeholder
      reviewCount: 0, // placeholder
      location: address, // placeholder
      distance: null,
      image: `/api/placeholder/600/400`, // hardcoded or replace later
      description: center.description,
      amenities: amenitiesRes.rows.map((r) => r.value),
      prices: price,
      openHours,
    });
  }

  return results;
};
