import { googleSignInService, login, signup } from "../services/authService.js";

export const signupController = async (req, res) => {
  console.log("Request Body (Before parsing):", req.body);
  const { email, password } = req.body;

  try {
    const { user, token } = await signup(email, password);
    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  const { idToken } = req.body; // Get the ID token from the client-side
  console.log("Received ID Token:", idToken);

  try {
    // Call the Google Sign-In service to process the token and return the user and JWT token
    const { user, token } = await googleSignInService(idToken);

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
export const logoutController = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
};
