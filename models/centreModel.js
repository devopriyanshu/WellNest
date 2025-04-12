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
        `INSERT INTO schedules (expert_id, day_of_week, is_open, opening_time, closing_time)
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
