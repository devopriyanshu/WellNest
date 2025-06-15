import {
  createNewAppointment,
  removeAppointment,
} from "../services/appointmentService.js";

// Create appointment controller
export const createAppointmentController = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const { expert_id, appointment_date, type, notes } = req.body;

    const appointment = await createNewAppointment({
      user_id: userId,
      expert_id,
      appointment_date,
      type,
      notes,
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error creating appointment:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete appointment controller
export const deleteAppointmentController = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    const deleted = await removeAppointment(appointmentId, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or unauthorized",
      });
    }

    res.status(200).json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    console.error("Delete Appointment Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
