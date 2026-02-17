import prisma from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import logger from '../utils/logger.js';

// ============================================
// SLEEP LOGS
// ============================================

export const fetchSleepLogs = async (userId) => {
  const logs = await prisma.sleepLog.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { date: 'desc' },
    take: 30, // Last 30 days
  });

  return logs;
};

export const addSleepLogService = async (userId, logData) => {
  const newLog = await prisma.sleepLog.create({
    data: {
      userId: parseInt(userId),
      date: new Date(logData.date),
      hours: logData.hours ? parseFloat(logData.hours) : null,
      quality: logData.quality,
      notes: logData.notes,
    },
  });

  logger.info(`Sleep log created for user ${userId}`);

  return newLog;
};

export const updateSleepLogService = async (userId, logId, updatedData) => {
  // Verify ownership
  const existingLog = await prisma.sleepLog.findUnique({
    where: { id: parseInt(logId) },
  });

  if (!existingLog || existingLog.userId !== parseInt(userId)) {
    throw new NotFoundError('Sleep log not found');
  }

  const updated = await prisma.sleepLog.update({
    where: { id: parseInt(logId) },
    data: {
      date: updatedData.date ? new Date(updatedData.date) : undefined,
      hours: updatedData.hours ? parseFloat(updatedData.hours) : undefined,
      quality: updatedData.quality,
      notes: updatedData.notes,
    },
  });

  logger.info(`Sleep log ${logId} updated`);

  return updated;
};

// ============================================
// ACTIVITY LOGS
// ============================================

export const fetchActivityLogs = async (userId) => {
  const logs = await prisma.activityLog.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { date: 'desc' },
    take: 30,
  });

  return logs;
};

export const addActivityLogService = async (userId, logData) => {
  const newLog = await prisma.activityLog.create({
    data: {
      userId: parseInt(userId),
      activities: logData.activities,
      date: logData.date ? new Date(logData.date) : new Date(),
      duration: logData.duration ? parseFloat(logData.duration) : null,
      calories: logData.calories ? parseInt(logData.calories) : null,
      notes: logData.notes,
    },
  });

  logger.info(`Activity log created for user ${userId}`);

  return newLog;
};

export const updateActivityLogService = async (userId, logId, updatedData) => {
  // Verify ownership
  const existingLog = await prisma.activityLog.findUnique({
    where: { id: parseInt(logId) },
  });

  if (!existingLog || existingLog.userId !== parseInt(userId)) {
    throw new NotFoundError('Activity log not found');
  }

  const updated = await prisma.activityLog.update({
    where: { id: parseInt(logId) },
    data: {
      activities: updatedData.activities,
      date: updatedData.date ? new Date(updatedData.date) : undefined,
      duration: updatedData.duration ? parseFloat(updatedData.duration) : undefined,
      calories: updatedData.calories ? parseInt(updatedData.calories) : undefined,
      notes: updatedData.notes,
    },
  });

  logger.info(`Activity log ${logId} updated`);

  return updated;
};

// ============================================
// MEAL LOGS
// ============================================

export const fetchMeals = async (userId) => {
  const logs = await prisma.mealLog.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { date: 'desc' },
    take: 30,
  });

  return logs;
};

export const addMealLogService = async (userId, logData) => {
  const newLog = await prisma.mealLog.create({
    data: {
      userId: parseInt(userId),
      name: logData.name,
      date: new Date(logData.date),
      time: new Date(logData.time),
      calories: logData.calories ? parseInt(logData.calories) : null,
      protein: logData.protein ? parseInt(logData.protein) : null,
      carbs: logData.carbs ? parseInt(logData.carbs) : null,
      fat: logData.fat ? parseInt(logData.fat) : null,
    },
  });

  logger.info(`Meal log created for user ${userId}`);

  return newLog;
};

export const updateMealLogService = async (userId, logId, updatedData) => {
  // Verify ownership
  const existingLog = await prisma.mealLog.findUnique({
    where: { id: parseInt(logId) },
  });

  if (!existingLog || existingLog.userId !== parseInt(userId)) {
    throw new NotFoundError('Meal log not found');
  }

  const updated = await prisma.mealLog.update({
    where: { id: parseInt(logId) },
    data: {
      name: updatedData.name,
      date: updatedData.date ? new Date(updatedData.date) : undefined,
      time: updatedData.time ? new Date(updatedData.time) : undefined,
      calories: updatedData.calories ? parseInt(updatedData.calories) : undefined,
      protein: updatedData.protein ? parseInt(updatedData.protein) : undefined,
      carbs: updatedData.carbs ? parseInt(updatedData.carbs) : undefined,
      fat: updatedData.fat ? parseInt(updatedData.fat) : undefined,
    },
  });

  logger.info(`Meal log ${logId} updated`);

  return updated;
};

// ============================================
// DASHBOARD AGGREGATION
// ============================================

export const fetchAppointments = async (userId) => {
  const appointments = await prisma.appointment.findMany({
    where: { userId: parseInt(userId) },
    include: {
      expert: {
        select: {
          id: true,
          name: true,
          category: true,
          profile_image: true,
        },
      },
    },
    orderBy: { appointmentDate: 'desc' },
    take: 10,
  });

  return appointments;
};

export const getUserDashboardData = async (userId) => {
  const [sleepLogs, appointments, activityLogs, meals] = await Promise.all([
    fetchSleepLogs(userId),
    fetchAppointments(userId),
    fetchActivityLogs(userId),
    fetchMeals(userId),
  ]);

  return {
    sleepLogs,
    appointments,
    activityLogs,
    meals,
  };
};
