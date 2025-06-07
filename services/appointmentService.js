import {
  createAppointment,
  deleteAppointment,
} from "../models/appointmentModel.js";

export const createNewAppointment = async (data) => {
  return await createAppointment(data);
};

export const removeAppointment = async (id) => {
  return await deleteAppointment(id);
};
