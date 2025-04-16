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
  const result = await pool.query("SELECT * FROM meals WHERE user_id = $1", [
    userId,
  ]);
  return result.rows;
};
