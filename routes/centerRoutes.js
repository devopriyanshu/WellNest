import { Router } from "express";
import { registerCenterController } from "../controllers/centerController.js";

const router = Router();

router.post("/register", registerCenterController);

export default router;
