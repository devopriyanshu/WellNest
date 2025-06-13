import { Router } from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
} from "../controllers/appointmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // Assuming you have JWT middleware

const router = Router();

router.post("/", authMiddleware, createAppointmentController);
router.delete("/:id", authMiddleware, deleteAppointmentController);

export default router;
