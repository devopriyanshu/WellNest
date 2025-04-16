import {
  getActivityLogsByUserId,
  getAppointmentsByUserId,
  getMealsByUserId,
  getSleepLogsByUserId,
} from "../models/logModel.js";

export const fetchSleepLogs = async (userId) => {
  return await getSleepLogsByUserId(userId);
};

export const fetchAppointments = async (userId) => {
  return await getAppointmentsByUserId(userId);
};

export const fetchActivityLogs = async (userId) => {
  return await getActivityLogsByUserId(userId);
};

export const fetchMeals = async (userId) => {
  return await getMealsByUserId(userId);
};
