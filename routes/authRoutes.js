import { Router } from "express";
import passport from "../config/passportConfig.js";
import {
  loginController,
  logoutController,
  signupController,
} from "../controllers/authController.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user || !req.user.token) {
      return res.redirect("http://localhost:5173?error=auth_failed");
    }

    // ✅ Send JWT to frontend
    res.redirect(`http://localhost:5173/login?token=${req.user.token}`);
  }
);

router.post("/login", loginController);

router.post("/signup", signupController);

export default router;
