import pool from "../config/db.js";

// Create a new appointment
export const createAppointment = async (data) => {
  const {
    user_id,
    expert_id,
    appointment_date,
    type,
    status = "upcoming",
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
export const findAppointmentsByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT 
      a.*,
      u.name as expert_name,
      u.email as expert_email,
      u.phone as expert_phone
     FROM appointments a
     LEFT JOIN experts u ON a.expert_id = u.id
     WHERE a.user_id = $1
     ORDER BY a.appointment_date DESC`,
    [userId]
  );

  return result.rows;
};

// Get appointments by expert ID with user details
export const findAppointmentsByExpertId = async (expertId) => {
  const result = await pool.query(
    `SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.phone as user_phone
     FROM appointments a
     LEFT JOIN users u ON a.user_id = u.id
     WHERE a.expert_id = $1
     ORDER BY a.appointment_date DESC`,
    [expertId]
  );

  return result.rows;
};

// Get appointments by both user ID and expert ID
export const findAppointmentsByUserAndExpert = async (userId, expertId) => {
  const result = await pool.query(
    `SELECT 
      a.*,
      u1.name as user_name,
      u1.email as user_email,
      u1.phone as user_phone,
      u2.name as expert_name,
      u2.email as expert_email,
      u2.phone as expert_phone
     FROM appointments a
     LEFT JOIN users u1 ON a.user_id = u1.id
     LEFT JOIN users u2 ON a.expert_id = u2.id
     WHERE a.user_id = $1 AND a.expert_id = $2
     ORDER BY a.appointment_date DESC`,
    [userId, expertId]
  );

  return result.rows;
};

// Update appointment status (for experts to accept/reject appointments)
export const updateAppointmentStatusById = async (
  appointmentId,
  status,
  userId
) => {
  const result = await pool.query(
    `UPDATE appointments
     SET status = $1, updated_at = NOW()
     WHERE id = $2 AND expert_id = $3
     RETURNING *`,
    [status, appointmentId, userId]
  );

  return result.rowCount > 0;
};

cron.schedule("*/5 * * * *", async () => {
  try {
    const res = await pool.query(
      `UPDATE appointments
       SET status = 'completed', updated_at = NOW()
       WHERE status = 'confirmed'
         AND appointment_time < NOW()
       RETURNING id`
    );
    console.log(`✅ Auto-completed ${res.rowCount} appointments`);
  } catch (err) {
    console.error("Error auto-updating appointments:", err);
  }
});
