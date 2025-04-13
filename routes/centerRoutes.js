import { Router } from "express";
import {
  listCenterController,
  registerCenterController,
} from "../controllers/centerController.js";

const router = Router();

router.post("/register", registerCenterController);
router.get("/list", listCenterController);

export default router;
