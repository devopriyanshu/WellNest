import { Router } from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
} from "../controllers/appointmentController.js";
import { verifyAuth } from "../middleware/auth.js"; // Assuming you have JWT middleware

const router = Router();

router.post("/", verifyAuth, createAppointmentController);
router.delete("/:id", verifyAuth, deleteAppointmentController);

export default router;
