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

export const deleteAppointment = async (appointmentId, userId) => {
  const query = `
    DELETE FROM appointments
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;

  const values = [appointmentId, userId];

  const result = await pool.query(query, values);
  return result.rowCount > 0;
};
