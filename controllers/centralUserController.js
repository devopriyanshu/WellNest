// controllers/userController.js
import { findUsersById } from "../models/userModel.js";
import { findCentralUserById } from "../models/centralUserModel.js";

export const getUserMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await findCentralUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let userIdRow = null;
    if (user.role === "user") {
      userIdRow = await findUsersById(user.id); // user.id = central_users.id
    }

    res.json({
      ...user,
      user_id: userIdRow?.id || null, // append the users.id as `user_id`
    });
  } catch (error) {
    console.error("Error in getUserMe:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
