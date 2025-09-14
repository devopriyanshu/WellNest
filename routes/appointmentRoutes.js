import { Router } from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAppointmentsByExpertIdController,
  getAppointmentsByUserAndExpertController,
  getAppointmentsByUserIdController,
  updateAppointmentStatusController,
} from "../controllers/appointmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // Assuming you have JWT middleware

const router = Router();

router.post("/", authMiddleware, createAppointmentController);
router.delete("/:id", authMiddleware, deleteAppointmentController);
// Get appointments by user ID
router.get("/user/:userId", authMiddleware, getAppointmentsByUserIdController);

// Get appointments by expert ID
router.get(
  "/expert/:expertId",
  authMiddleware,
  getAppointmentsByExpertIdController
);

// Get appointments by both user and expert ID
router.get(
  "/user/:userId/expert/:expertId",
  authMiddleware,
  getAppointmentsByUserAndExpertController
);

// Update appointment status (for experts to accept/reject)
router.patch("/:id/status", authMiddleware, updateAppointmentStatusController);

export default router;
