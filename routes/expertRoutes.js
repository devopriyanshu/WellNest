import { registerExpertController } from "../controllers/expertController.js";
import { Router } from "express";

const router = Router();

router.post("/register", registerExpertController);

export default router;
