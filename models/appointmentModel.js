import pool from "../config/db.js";

export const createAppointment = async (data) => {
  const { user_id, expert_id, appointment_date, type, status, notes } = data;

  const result = await pool.query(
    `INSERT INTO appointments 
      (user_id, expert_id, appointment_date, type, status, notes) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [user_id, expert_id, appointment_date, type, status, notes]
  );

  return result.rows[0];
};

export const deleteAppointment = async (id) => {
  const result = await pool.query(
    `DELETE FROM appointments WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};
