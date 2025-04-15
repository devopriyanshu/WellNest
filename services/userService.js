import { findUsersById, updateUsersModel } from "../models/userModel.js";

export const getUserById = async (userId) => {
  const user = await findUsersById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserService = async (userId, profileData) => {
  const existingUser = await findUsersById(userId);
  if (!existingUser) {
    throw new Error("User not found");
  }

  const updateUser = await updateUsersModel(userId, profileData);
  return updateUser;
};
