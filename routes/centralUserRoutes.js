// routes/userRoutes.js
import express from "express";
import { getUserMe } from "../controllers/centralUserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getUserMe); // protected route

export default router;
