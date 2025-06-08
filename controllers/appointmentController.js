import {
  createNewAppointment,
  removeAppointment,
} from "../services/appointmentService.js";

export const createAppointmentController = async (req, res) => {
  try {
    const userId = req.user?.userId; // Set by auth middleware
    const { expert_id, appointment_date, type = null, notes = null } = req.body;

    // Input validation
    if (!expert_id || !appointment_date) {
      return res.status(400).json({
        success: false,
        message: "expert_id and appointment_date are required",
      });
    }

    const appointment = await AppointmentService.createNewAppointment({
      user_id: userId,
      expert_id,
      appointment_date,
      type,
      notes,
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create appointment" });
  }
};

export const deleteAppointmentController = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const userId = req.user.userId; // Extracted from middleware (e.g., decoded JWT)

    const deleted = await removeAppointment(appointmentId, userId);

    if (!deleted) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Appointment not found or not authorized",
        });
    }

    res
      .status(200)
      .json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete Appointment Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
