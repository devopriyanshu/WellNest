import {
  addActivityLogService,
  addMealLogService,
  addSleepLogService,
  fetchActivityLogs,
  fetchMeals,
  fetchSleepLogs,
  updateActivityLogService,
  updateMealLogService,
  updateSleepLogService,
  getUserDashboardData,
} from '../services/logServices.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get all dashboard logs
export const getUserDashboardLogs = asyncHandler(async (req, res) => {
  const userId = req.user.refId;

  const dashboardData = await getUserDashboardData(userId);

  res.json({
    success: true,
    data: dashboardData,
  });
});

// ============================================
// SLEEP LOGS
// ============================================

export const getSleepLogs = asyncHandler(async (req, res) => {
  const userId = req.user.refId;
  const logs = await fetchSleepLogs(userId);
  
  res.json({
    success: true,
    data: logs,
  });
});

export const addSleepLogController = asyncHandler(async (req, res) => {
  const userId = req.user.refId;
  const logData = req.body;

  const newLog = await addSleepLogService(userId, logData);
  
  res.status(201).json({ 
    success: true, 
    message: 'Sleep log added successfully',
    data: newLog 
  });
});

export const updateSleepLogController = asyncHandler(async (req, res) => {
  const userId = req.user.refId;
  const { logId } = req.params;
  const updatedData = req.body;

  const updated = await updateSleepLogService(userId, logId, updatedData);
  
  res.status(200).json({ 
    success: true, 
    message: 'Sleep log updated successfully',
    data: updated 
  });
});

// ============================================
// ACTIVITY LOGS
// ============================================

export const getActivityLogs = asyncHandler(async (req, res) => {
  const userId = req.user.refId;
  const logs = await fetchActivityLogs(userId);
  
  res.json({
    success: true,
    data: logs,
  });
});

export const addActivityLogController = asyncHandler(async (req, res) => {
  const userId = req.user.refId;
  const logData = req.body;

  const newLog = await addActivityLogService(userId, logData);
  
  res.status(201).json({ 
    success: true, 
    message: 'Activity log added successfully',
    data: newLog 
  });
});

export const updateActivityLogController = asyncHandler(async (req, res) => {
  const userId = req.user.refId;
  const { logId } = req.params;
  const updatedData = req.body;

  const updated = await updateActivityLogService(userId, logId, updatedData);
  
  res.status(200).json({ 
    success: true, 
    message: 'Activity log updated successfully',
    data: updated 
  });
});

// ============================================
// MEAL LOGS
// ============================================

export const getMeals = asyncHandler(async (req, res) => {
  const userId = req.user.refId;
  const logs = await fetchMeals(userId);
  
  res.json({
    success: true,
    data: logs,
  });
});

export const addMealLogController = asyncHandler(async (req, res) => {
  const userId = req.user.refId;
  const logData = req.body;

  const newLog = await addMealLogService(userId, logData);
  
  res.status(201).json({ 
    success: true, 
    message: 'Meal log added successfully',
    data: newLog 
  });
});

export const updateMealLogController = asyncHandler(async (req, res) => {
  const userId = req.user.refId;
  const { logId } = req.params;
  const updatedData = req.body;

  const updated = await updateMealLogService(userId, logId, updatedData);
  
  res.status(200).json({ 
    success: true, 
    message: 'Meal log updated successfully',
    data: updated 
  });
});
