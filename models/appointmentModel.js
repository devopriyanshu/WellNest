import pool from "../config/db.js";

// Create a new appointment
export const createAppointment = async (data) => {
  const {
    user_id,
    expert_id,
    appointment_date,
    type,
    status = "pending",
    notes,
  } = data;

  const result = await pool.query(
    `INSERT INTO appointments 
      (user_id, expert_id, appointment_date, type, status, notes) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [user_id, expert_id, appointment_date, type, status, notes]
  );

  return result.rows[0];
};

// Delete appointment (only if created by user)
export const deleteAppointment = async (appointmentId, userId) => {
  const result = await pool.query(
    `DELETE FROM appointments
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [appointmentId, userId]
  );

  return result.rowCount > 0;
};
