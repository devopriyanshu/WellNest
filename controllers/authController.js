import crypto from 'crypto';
import { login, signup } from "../services/authService.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import prisma from "../config/prisma.js";

export const signupController = async (req, res) => {
  console.log("📥 Request Body:", req.body);

  const { email, password, role } = req.body;

  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Pass verificationToken to service or handle it here. 
    // Since authService.signup handles user creation, we might need to modify it or update the user immediately after.
    // Let's modify the flow to be cleaner:
    // 1. Call signup service (which creates user).
    // 2. Update user with verification token.
    // 3. Send email.
    
    // NOTE: This assumes authService.signup creates the user with isVerified: false by default (which it does).
    const { user } = await signup(email, password, role);
    
    // Update user with verification token
    await prisma.centralUser.update({
      where: { id: user.id },
      data: { verificationToken }
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);
    console.log(`✉️ Verification email sent to ${email}`);

    res.status(201).json({
      message: "User registered successfully. Please check your email to verify your account.",
      user: { ...user, isVerified: false }, // Explicitly show not verified
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(400).json({ error: error.message || "Signup failed" });
  }
};

export const verifyEmailController = async (req, res) => {
  const { token } = req.query; // Expecting ?token=xyz

  if (!token) {
    return res.status(400).json({ error: "Verification token is required" });
  }

  try {
    const user = await prisma.centralUser.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification token" });
    }

    await prisma.centralUser.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    console.log(`✅ User verified: ${user.email}`);

    res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error("❌ Verification error:", error);
    res.status(500).json({ error: "Email verification failed" });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check verification status before logging in
    // This logic duplicates some of authService.login but is necessary for the specific error message
    // Ideally, authService.login should handle this check.
    // Let's rely on authService.login, but we need to update it to check isVerified.
    // For now, let's catch the login and check the user object if returned, or handle it in service.
    
    // Actually, asking the service to check is better. 
    // But since I can't edit service in this tool call, I'll do a pre-check here or filter the result.
    
    const { user, token } = await login(email, password);
    
    if (!user.isVerified) {
       return res.status(403).json({ error: "Please verify your email before logging in." });
    }

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const googleAuthController = async (req, res) => {
  res.status(400).json({ error: "Use /auth/google instead" });
};

export const logoutController = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
};
