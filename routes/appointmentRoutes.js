import {
  createAppointmentController,
  deleteAppointmentController,
} from "../controllers/appointmentController.js";
import { Router } from "express";
const router = Router();

router.post("/", createAppointmentController);
router.delete("/:id", deleteAppointmentController);

export default router;
