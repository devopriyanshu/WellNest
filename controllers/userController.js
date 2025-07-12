import { getUserById, updateUserService } from "../services/userService.js";

export const getUserMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);

    const user = await getUserById(userId);
    res.json(user);
  } catch (err) {
    console.error("Error in getUserMe:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateUserControler = async (req, res) => {
  const userId = req.user.userId;
  const {
    full_name,
    email,
    phone_number,
    gender,
    dob,
    profile_picture,
    address,
    language_preference,
    height,
    weight,
  } = req.body;

  try {
    const updatedUser = await updateUserService(userId, {
      full_name,
      email,
      phone_number,
      gender,
      dob,
      profile_picture,
      address,
      language_preference,
      height,
      weight,
    });
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error:", err.message);
    res
      .status(400)
      .json({ message: err.message || "Failed to update profile" });
  }
};
