import {
  createNewAppointment,
  getAppointmentsByExpertId,
  getAppointmentsByUserAndExpert,
  getAppointmentsByUserId,
  removeAppointment,
  updateAppointmentStatus,
} from '../services/appointmentService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Create appointment controller
export const createAppointmentController = asyncHandler(async (req, res) => {
  const userId = req.user.refId; // From auth middleware

  const { expert_id, appointment_date, type, notes } = req.body;

  const appointment = await createNewAppointment({
    user_id: userId,
    expert_id,
    appointment_date,
    type,
    notes,
  });

  res.status(201).json({ 
    success: true, 
    message: 'Appointment created successfully',
    data: appointment 
  });
});

// Delete appointment controller
export const deleteAppointmentController = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id;
  const userId = req.user.refId;

  await removeAppointment(appointmentId, userId);

  res.status(200).json({ 
    success: true, 
    message: 'Appointment deleted successfully' 
  });
});

export const getAppointmentsByUserIdController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requestUserId = req.user.refId;

  // Check if user is requesting their own appointments or is an admin
  if (parseInt(userId) !== requestUserId && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to view these appointments',
    });
  }

  const appointments = await getAppointmentsByUserId(userId);

  res.status(200).json({ 
    success: true, 
    data: appointments 
  });
});

// Get appointments by expert ID controller
export const getAppointmentsByExpertIdController = asyncHandler(async (req, res) => {
  const { expertId } = req.params;
  const requestUserId = req.user.refId;

  // Check if user is the expert or is an admin
  if (parseInt(expertId) !== requestUserId && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to view these appointments',
    });
  }

  const appointments = await getAppointmentsByExpertId(expertId);

  res.status(200).json({ 
    success: true, 
    data: appointments 
  });
});

// Get appointments by both user and expert ID controller
export const getAppointmentsByUserAndExpertController = asyncHandler(async (req, res) => {
  const { userId, expertId } = req.params;
  const requestUserId = req.user.refId;

  // Check if user is either the user or the expert in the appointment
  if (
    parseInt(userId) !== requestUserId &&
    parseInt(expertId) !== requestUserId &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to view these appointments',
    });
  }

  const appointments = await getAppointmentsByUserAndExpert(userId, expertId);

  res.status(200).json({ 
    success: true, 
    data: appointments 
  });
});

// Update appointment status controller (for experts)
export const updateAppointmentStatusController = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id;
  const { status } = req.body;
  const userId = req.user.refId;

  if (!['pending', 'upcoming', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status value',
    });
  }

  const updated = await updateAppointmentStatus(appointmentId, status, userId);

  res.status(200).json({ 
    success: true, 
    message: 'Appointment status updated successfully',
    data: updated 
  });
});
