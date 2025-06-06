import { Router } from "express";
const router = Router();
import {
  createAppointmentController,
  deleteAppointmentController,
} from "../controllers/appointmentController";

router.post("/", createAppointmentController);
router.delete("/:id", deleteAppointmentController);

export default router;
