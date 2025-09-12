import upload from "../middleware/cloudinaryUpload.js";
import {
  getExpertController,
  listExpertsController,
  registerExpertController,
  updateExpertController,
} from "../controllers/expertController.js";
import { Router } from "express";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  registerExpertController
);
router.put("/:id", updateExpertController);
router.get("/list", listExpertsController);

router.get("/:id", getExpertController);

export default router;
