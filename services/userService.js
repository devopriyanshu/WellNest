import prisma from '../config/prisma.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const getUserById = async (userId) => {
  const user = await prisma.user.findFirst({
    where: { user_id: userId },
    include: {
      centralUser: {
        select: {
          email: true,
          role: true,
          isVerified: true,
          isActive: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export const updateUserService = async (userId, updateData) => {
  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: { user_id: userId },
  });

  if (!existingUser) {
    throw new NotFoundError('User profile not found');
  }

  // Map camelCase to snake_case for database
  const dbData = {
    fullName: updateData.full_name || updateData.fullName,
    email: updateData.email,
    phoneNumber: updateData.phone_number || updateData.phoneNumber,
    gender: updateData.gender,
    dob: updateData.dob ? new Date(updateData.dob) : undefined,
    profilePicture: updateData.profile_picture || updateData.profilePicture,
    address: updateData.address,
    languagePreference: updateData.language_preference || updateData.languagePreference,
    height: updateData.height ? parseFloat(updateData.height) : undefined,
    weight: updateData.weight ? parseFloat(updateData.weight) : undefined,
  };

  // Remove undefined values
  Object.keys(dbData).forEach(key => dbData[key] === undefined && delete dbData[key]);

  const updatedUser = await prisma.user.update({
    where: { id: existingUser.id },
    data: dbData,
    include: {
      centralUser: {
        select: {
          email: true,
          role: true,
        },
      },
    },
  });

  logger.info(`User profile updated: ${userId}`);

  return updatedUser;
};

export const createUserProfile = async (centralUserId, profileData) => {
  const user = await prisma.user.create({
    data: {
      user_id: centralUserId,
      fullName: profileData.fullName || profileData.full_name,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber || profileData.phone_number,
      gender: profileData.gender,
      dob: profileData.dob ? new Date(profileData.dob) : undefined,
      profilePicture: profileData.profilePicture || profileData.profile_picture,
      address: profileData.address,
      languagePreference: profileData.languagePreference || profileData.language_preference,
      height: profileData.height ? parseFloat(profileData.height) : undefined,
      weight: profileData.weight ? parseFloat(profileData.weight) : undefined,
    },
  });

  logger.info(`User profile created for central user: ${centralUserId}`);

  return user;
};

export const getAllUsersService = async (filters = {}, page = 1, limit = 20) => {
  const where = {};
  
  if (filters.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.gender) {
    where.gender = filters.gender;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        centralUser: {
          select: {
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
