import { findAppointmentsByUserId } from "../models/appointmentModel.js";
import {
  addActivityLogService,
  addMealLogService,
  addSleepLogService,
  fetchActivityLogs,
  fetchAppointments,
  fetchMeals,
  fetchSleepLogs,
  updateActivityLogService,
  updateMealLogService,
  updateSleepLogService,
} from "../services/logServices.js";

// export const getSleepLogs = async (req, res) => {
//   try {
//     const logs = await fetchSleepLogs(req.user.id);
//     res.json(logs);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch sleep logs" });
//   }
// };
// export const getAppointments = async (req, res) => {
//     try {
//       const logs = await fetchAppointments(req.user.id);
//       res.json(logs);
//     } catch (err) {
//       res.status(500).json({ error: "Failed to fetch appointments" });
//     }
//   };

//   export const getActivityLogs = async (req, res) => {
//     try {
//       const logs = await fetchActivityLogs(req.user.id);
//       res.json(logs);
//     } catch (err) {
//       res.status(500).json({ error: "Failed to fetch activity logs" });
//     }
//   };

//   export const getMeals = async (req, res) => {
//     try {
//       const logs = await fetchMeals(req.user.id);
//       res.json(logs);
//     } catch (err) {
//       res.status(500).json({ error: "Failed to fetch meals" });
//     }
//   };

export const getUserDashboardLogs = async (req, res) => {
  const userId = req.user.refId;

  try {
    const [sleepLogs, appointments, activityLogs, meals] = await Promise.all([
      fetchSleepLogs(userId),
      findAppointmentsByUserId(userId),
      fetchActivityLogs(userId),
      fetchMeals(userId),
    ]);

    res.json({
      sleepLogs,
      appointments,
      activityLogs,
      meals,
    });
  } catch (err) {
    console.error("Error fetching dashboard logs:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

// Activity Log Controller
export const updateActivityLogController = async (req, res) => {
  const userId = req.user.refId;
  const { logId } = req.params;
  const updatedData = req.body;

  try {
    const updated = await updateActivityLogService(userId, logId, updatedData);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Meal Log Controller
export const updateMealLogController = async (req, res) => {
  const userId = req.user.refId;
  const { logId } = req.params;
  const updatedData = req.body;

  try {
    const updated = await updateMealLogService(userId, logId, updatedData);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Sleep Log Controller
export const updateSleepLogController = async (req, res) => {
  const userId = req.user.refId;
  const { logId } = req.params;
  const updatedData = req.body;

  try {
    await updateSleepLogService(userId, logId, updatedData);
    res.status(200).json({ success: true, message: "Sleep log updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addSleepLogController = async (req, res) => {
  // console.log(req.user);
  const userId = req.user.refId; // assuming auth middleware adds this
  const logData = req.body;

  try {
    const newLog = await addSleepLogService(userId, logData);
    res.status(201).json({ success: true, data: newLog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Activity Log Controller
export const addActivityLogController = async (req, res) => {
  const userId = req.user.refId;
  const logData = req.body;

  try {
    const newLog = await addActivityLogService(userId, logData);
    res.status(201).json({ success: true, data: newLog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Meal Log Controller
export const addMealLogController = async (req, res) => {
  const userId = req.user.refId;
  const logData = req.body;

  try {
    const newLog = await addMealLogService(userId, logData);
    res.status(201).json({ success: true, data: newLog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
