import {
  createAppointment,
  deleteAppointment,
  findAppointmentsByExpertId,
  findAppointmentsByUserAndExpert,
  findAppointmentsByUserId,
  updateAppointmentStatusById,
} from "../models/appointmentModel.js";

export const createNewAppointment = async (data) => {
  return await createAppointment(data);
};

export const removeAppointment = async (id, userId) => {
  return await deleteAppointment(id, userId);
};
export const getAppointmentsByUserId = async (userId) => {
  return await findAppointmentsByUserId(userId);
};

export const getAppointmentsByExpertId = async (expertId) => {
  return await findAppointmentsByExpertId(expertId);
};

export const getAppointmentsByUserAndExpert = async (userId, expertId) => {
  return await findAppointmentsByUserAndExpert(userId, expertId);
};

export const updateAppointmentStatus = async (
  appointmentId,
  status,
  userId
) => {
  return await updateAppointmentStatusById(appointmentId, status, userId);
};
