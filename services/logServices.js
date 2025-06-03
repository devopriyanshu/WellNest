import {
  addActivityLog,
  addMealLog,
  addSleepLog,
  getActivityLogsByUserId,
  getAppointmentsByUserId,
  getMealsByUserId,
  getSleepLogsByUserId,
  updateActivityLog,
  updateMealLog,
  updateSleepLog,
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

export const updateActivityLogService = async (userId, logId, updatedData) => {
  return await updateActivityLog(userId, logId, updatedData);
};
export const updateMealLogService = async (userId, logId, updatedData) => {
  return await updateMealLog(userId, logId, updatedData);
};
export const updateSleepLogService = async (userId, logId, updatedData) => {
  return await updateSleepLog(userId, logId, updatedData);
};

export const addSleepLogService = async (userId, data) => {
  return await addSleepLog(userId, data);
};

export const addActivityLogService = async (userId, data) => {
  return await addActivityLog(userId, data);
};

export const addMealLogService = async (userId, data) => {
  return await addMealLog(userId, data);
};
