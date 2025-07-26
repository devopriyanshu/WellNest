import {
  getExpertController,
  listExpertsController,
  registerExpertController,
  updateExpertController,
} from "../controllers/expertController.js";
import { Router } from "express";

const router = Router();

router.post("/register", registerExpertController);
router.put("/:id", updateExpertController);
router.get("/list", listExpertsController);

router.get("/:id", getExpertController);

export default router;
