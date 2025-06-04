import pool from "../config/db.js";

export const getSleepLogsByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM sleep_logs WHERE user_id = $1",
    [userId]
  );
  return result.rows;
};

export const getAppointmentsByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM appointments WHERE user_id = $1",
    [userId]
  );
  return result.rows;
};

export const getActivityLogsByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM activity_logs WHERE user_id = $1",
    [userId]
  );
  return result.rows;
};

export const getMealsByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM meal_logs WHERE user_id = $1",
    [userId]
  );
  return result.rows;
};

export const updateSleepLog = async (userId, logId, updatedData) => {
  const result = await pool.query(
    `UPDATE sleep_logs SET hours = $1, quality = $2, notes = $3 WHERE id = $4 AND user_id = $5`,
    [
      updatedData.hours,
      updatedData.quality,
      updatedData.notes,
      updatedData.id,
      userId,
    ]
  );
};
export const updateActivityLog = async (userId, logId, updatedData) => {
  const { activity, date, duration, calories, notes } = updatedData;

  const result = await pool.query(
    `
    UPDATE activities
    SET activity = $1,
        date = $2,
        duration = $3,
        calories = $4,
        notes = $5
    WHERE id = $6 AND user_id = $7
    RETURNING *;
    `,
    [activity, date, duration, calories, notes, logId, userId]
  );

  return result.rows[0];
};

export const updateMealLog = async (userId, mealId, updatedData) => {
  const { name, date, time, calories, protein, carbs, fat } = updatedData;

  const result = await pool.query(
    `
    UPDATE meals
    SET name = $1,
        date = $2,
        time = $3,
        calories = $4,
        protein = $5,
        carbs = $6,
        fat = $7
    WHERE id = $8 AND user_id = $9
    RETURNING *;
    `,
    [name, date, time, calories, protein, carbs, fat, mealId, userId]
  );

  return result.rows[0];
};

export const addSleepLog = async (userId, logData) => {
  const { hours, quality, notes, date } = logData;
  if (!userId || !date) {
    throw new Error("Missing userId or date");
  }

  const result = await pool.query(
    `
    INSERT INTO sleep_logs (user_id, hours, quality, notes, date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [userId, hours, quality, notes, date]
  );

  return result.rows[0];
};
export const addActivityLog = async (userId, logData) => {
  console.log(userId);
  const { activity, date, duration, calories, notes } = logData;
  if (!userId || !date) {
    throw new Error("Missing userId or date");
  }
  const result = await pool.query(
    `
    INSERT INTO activity_logs (user_id, activities, date, duration, calories, notes)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `,
    [userId, activity, date, duration, calories, notes]
  );

  return result.rows[0];
};
export const addMealLog = async (userId, logData) => {
  const { name, date, time, calories, protein, carbs, fat } = logData;

  const result = await pool.query(
    `
    INSERT INTO meal_logs (user_id, name, date, time, calories, protein, carbs, fat)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
    `,
    [userId, name, date, time, calories, protein, carbs, fat]
  );

  return result.rows[0];
};
