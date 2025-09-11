import { Router } from "express";
import {
  getCenterByIdController,
  listCenterController,
  registerCenterController,
  updateCenterByIdController,
} from "../controllers/centerController.js";
import upload from "../middleware/cloudinaryUpload.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "centerImage", maxCount: 1 }, // single main image
    { name: "images", maxCount: 10 }, // multiple gallery images
  ]),
  registerCenterController
);

router.get("/list", listCenterController);
router.get("/:id", getCenterByIdController); // ⬅ Get by ID
router.put("/:id", updateCenterByIdController); // ⬅ Update center

export default router;
