import {
  createNewAppointment,
  removeAppointment,
} from "../services/appointmentService.js";

export const createAppointmentController = async (req, res) => {
  try {
    const appointment = await createNewAppointment(req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Create Appointment Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteAppointmentController = async (req, res) => {
  try {
    const deleted = await removeAppointment(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    console.error("Delete Appointment Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
