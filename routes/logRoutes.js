import express from "express";
import {
  addActivityLogController,
  addMealLogController,
  addSleepLogController,
  getUserDashboardLogs,
  updateActivityLogController,
  updateMealLogController,
  updateSleepLogController,
} from "../controllers/logController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-logs", authMiddleware, getUserDashboardLogs);

// Update activity log
router.put("/activity/:logId", authMiddleware, updateActivityLogController);

// Update meal log
router.put("/meal/:logId", authMiddleware, updateMealLogController);

// Update sleep log
router.put("/sleep/:logId", authMiddleware, updateSleepLogController);

// Add a sleep log
router.post("/sleep", authMiddleware, addSleepLogController);

// Add an activity log
router.post("/activity", authMiddleware, addActivityLogController);

// Add a meal log
router.post("/meal", authMiddleware, addMealLogController);

export default router;
