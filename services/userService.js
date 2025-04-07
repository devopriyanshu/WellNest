import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserModel,
} from "../models/userModel.js";

export const getUserById = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserService = async (userId, profileData) => {
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw new Error("User not found");
  }

  const updateUser = await updateUserModel(userId, profileData);
  return updateUser;
};
