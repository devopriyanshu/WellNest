import prisma from '../config/prisma.js';
import { generateToken } from '../utils/jwtUtility.js';
import { comparepassword, hashpassword } from '../utils/passwordUtil.js';
import { ValidationError, UnauthorizedError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const signup = async (email, password, role = 'user') => {
  // Check if user exists
  const existingUser = await prisma.centralUser.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ValidationError('User already exists');
  }

  const name = email.split('@')[0];
  const hashedPassword = await hashpassword(password);
  logger.info(`Creating new user: ${email} with role: ${role}`);

  // Create central user and profile in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create central user
    const centralUser = await tx.centralUser.create({
      data: {
        email,
        password: hashedPassword,
        role: role.toLowerCase(),
        name,
        provider: 'local',
        isVerified: false,
        isActive: true,
        status: 'active',
      },
    });

    // Create profile based on role
    let profile = null;
    if (role.toLowerCase() === 'user') {
      profile = await tx.user.create({
        data: {
          user_id: centralUser.id,
          fullName: name,
          email: email,
        },
      });
    }

    return { centralUser, profile };
  });

  const token = generateToken(result.centralUser.id, role);
  
  logger.info(`User created successfully: ${email}`);

  return {
    user: {
      id: result.centralUser.id,
      email: result.centralUser.email,
      role: result.centralUser.role,
      name: result.centralUser.name,
    },
    token,
  };
};

export const login = async (email, password) => {
  // Find user with profile data
  const centralUser = await prisma.centralUser.findUnique({
    where: { email },
    include: {
      users: true,
      experts: true,
      centers: true,
      admins: true,
    },
  });

  if (!centralUser) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!centralUser.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  const isValid = await comparepassword(password, centralUser.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Update last login
  await prisma.centralUser.update({
    where: { id: centralUser.id },
    data: { lastLogin: new Date() },
  });

  const token = generateToken(centralUser.id, centralUser.role);

  logger.info(`User logged in: ${email}`);

  // Return user data based on role
  let profileData = null;
  if (centralUser.users.length > 0) {
    profileData = centralUser.users[0];
  } else if (centralUser.experts.length > 0) {
    profileData = centralUser.experts[0];
  } else if (centralUser.centers.length > 0) {
    profileData = centralUser.centers[0];
  } else if (centralUser.admins.length > 0) {
    profileData = centralUser.admins[0];
  }

  return {
    user: {
      id: centralUser.id,
      email: centralUser.email,
      role: centralUser.role,
      name: centralUser.name,
      isVerified: centralUser.isVerified,
      profile: profileData,
    },
    token,
  };
};

export const googleSignIn = async (googleId, email, name) => {
  // Find or create user
  let centralUser = await prisma.centralUser.findFirst({
    where: {
      OR: [
        { email },
        { googleId },
      ],
    },
    include: {
      users: true,
    },
  });

  if (!centralUser) {
    // Create new user with Google auth
    const result = await prisma.$transaction(async (tx) => {
      const newCentralUser = await tx.centralUser.create({
        data: {
          email,
          googleId,
          name,
          role: 'user',
          provider: 'google',
          isVerified: true,
          isActive: true,
          status: 'active',
        },
      });

      const userProfile = await tx.user.create({
        data: {
          user_id: newCentralUser.id,
          fullName: name,
          email: email,
        },
      });

      return { centralUser: newCentralUser, profile: userProfile };
    });

    centralUser = result.centralUser;
    logger.info(`New Google user created: ${email}`);
  } else {
    // Update Google ID if not set
    if (!centralUser.googleId) {
      centralUser = await prisma.centralUser.update({
        where: { id: centralUser.id },
        data: { googleId },
      });
    }

    // Heal: create missing User profile for existing users who don't have one
    const existingProfile = await prisma.user.findFirst({
      where: { user_id: centralUser.id },
    });
    if (!existingProfile && centralUser.role === 'user') {
      logger.info(`Healing missing User profile for CentralUser ${centralUser.id} (${centralUser.email})`);
      await prisma.user.create({
        data: {
          user_id: centralUser.id,
          fullName: centralUser.name || email.split('@')[0],
          email: centralUser.email,
        },
      });
    }

    // Update last login
    await prisma.centralUser.update({
      where: { id: centralUser.id },
      data: { lastLogin: new Date() },
    });

    logger.info(`Existing Google user logged in: ${email}`);
  }

  const token = generateToken(centralUser.id, centralUser.role);

  return {
    user: {
      id: centralUser.id,
      email: centralUser.email,
      role: centralUser.role,
      name: centralUser.name,
      isVerified: centralUser.isVerified,
    },
    token,
  };
};
