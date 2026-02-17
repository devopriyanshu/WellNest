import { getUserById, updateUserService } from '../services/userService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getUserMe = asyncHandler(async (req, res) => {
  const userId = req.user.centralUserId;

  const user = await getUserById(userId);
  
  res.json({
    success: true,
    data: user,
  });
});

export const updateUserControler = asyncHandler(async (req, res) => {
  const userId = req.user.centralUserId;
  const {
    full_name,
    fullName,
    email,
    phone_number,
    phoneNumber,
    gender,
    dob,
    profile_picture,
    profilePicture,
    address,
    language_preference,
    languagePreference,
    height,
    weight,
  } = req.body;

  const updatedUser = await updateUserService(userId, {
    full_name: full_name || fullName,
    email,
    phone_number: phone_number || phoneNumber,
    gender,
    dob,
    profile_picture: profile_picture || profilePicture,
    address,
    language_preference: language_preference || languagePreference,
    height,
    weight,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});
