// const { getUserMe } = require("controllers/userController.js");
// const { Router } = require("express");
// const { authMiddleware } = require("middleware/authMiddleware.js");

import {
  getUserMe,
  updateUserControler,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/me", authMiddleware, getUserMe);
router.post("/update", authMiddleware, updateUserControler);

export default router;
