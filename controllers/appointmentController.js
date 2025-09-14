import {
  createNewAppointment,
  getAppointmentsByExpertId,
  getAppointmentsByUserAndExpert,
  getAppointmentsByUserId,
  removeAppointment,
  updateAppointmentStatus,
} from "../services/appointmentService.js";

// Create appointment controller
export const createAppointmentController = async (req, res) => {
  try {
    const userId = req.user.refId; // From auth middleware

    const { expert_id, appointment_date, type, status, notes } = req.body;

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

export const getAppointmentsByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestUserId = req.user.id;

    // Check if user is requesting their own appointments or is an admin
    if (parseInt(userId) !== requestUserId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view these appointments",
      });
    }

    const appointments = await getAppointmentsByUserId(userId);

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching user appointments:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get appointments by expert ID controller
export const getAppointmentsByExpertIdController = async (req, res) => {
  try {
    const { expertId } = req.params;
    const requestUserId = req.user.id;

    // Check if user is the expert or is an admin
    if (parseInt(expertId) !== requestUserId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view these appointments",
      });
    }

    const appointments = await getAppointmentsByExpertId(expertId);

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching expert appointments:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get appointments by both user and expert ID controller
export const getAppointmentsByUserAndExpertController = async (req, res) => {
  try {
    const { userId, expertId } = req.params;
    const requestUserId = req.user.id;

    // Check if user is either the user or the expert in the appointment
    if (
      parseInt(userId) !== requestUserId &&
      parseInt(expertId) !== requestUserId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view these appointments",
      });
    }

    const appointments = await getAppointmentsByUserAndExpert(userId, expertId);

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching user-expert appointments:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update appointment status controller (for experts)
export const updateAppointmentStatusController = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;

    if (!["upcoming", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updated = await updateAppointmentStatus(
      appointmentId,
      status,
      userId
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or unauthorized",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Appointment status updated" });
  } catch (error) {
    console.error("Update Appointment Status Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
