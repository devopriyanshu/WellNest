import {
  fetchActivityLogs,
  fetchAppointments,
  fetchMeals,
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
  const userId = req.user.id;

  try {
    const [sleepLogs, appointments, activityLogs, meals] = await Promise.all([
      fetchSleepLogs(userId),
      fetchAppointments(userId),
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
