// controllers/userController.js
import { findUserById } from "../models/centralUserModel.js";

export const getUserMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in getUserMe:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
