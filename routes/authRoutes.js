import { Router } from "express";
import passport from "../config/passportConfig.js";
import {
  googleAuthController,
  logoutController,
} from "../controllers/authController.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthController
);

router.get("/logout", logoutController);

export default router;
