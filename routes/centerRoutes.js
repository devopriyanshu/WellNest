import { Router } from "express";
import {
  getCenterByIdController,
  listCenterController,
  registerCenterController,
  updateCenterByIdController,
} from "../controllers/centerController.js";

const router = Router();

router.post("/register", registerCenterController);
router.get("/list", listCenterController);
router.get("/:id", getCenterByIdController); // ⬅ Get by ID
router.put("/:id", updateCenterByIdController); // ⬅ Update center

export default router;
