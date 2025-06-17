import { login, signup } from "../services/authService.js";

export const signupController = async (req, res) => {
  console.log("📥 Request Body:", req.body);

  const { email, password, role } = req.body;

  try {
    const { user, token } = await signup(email, password, role);
    console.log("✅ Signup successful:", user);

    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(400).json({ error: error.message || "Signup failed" });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, token } = await login(email, password);
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
