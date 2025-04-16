import express from "express";
import { getUserDashboardLogs } from "../controllers/logController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-logs", authMiddleware, getUserDashboardLogs);

export default router;
