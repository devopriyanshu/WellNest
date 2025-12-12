import prisma from '../config/prisma.js';

/**
 * User Model - User profiles and health data
 */
class UserModel {
  /**
   * Find user by central user ID
   */
  static async findByCentralUserId(centralUserId) {
    return await prisma.user.findFirst({
      where: { user_id: centralUserId },
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
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        centralUser: true,
      },
    });
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    return await prisma.user.findFirst({
      where: { email },
      include: {
        centralUser: true,
      },
    });
  }

  /**
   * Create user profile
   */
  static async create(data) {
    return await prisma.user.create({
      data,
      include: {
        centralUser: true,
      },
    });
  }

  /**
   * Update user profile
   */
  static async update(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
      include: {
        centralUser: true,
      },
    });
  }

  /**
   * List users with filters
   */
  static async findMany(where = {}, options = {}) {
    const { skip, take, orderBy } = options;
    
    return await prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        centralUser: {
          select: {
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }

  /**
   * Count users
   */
  static async count(where = {}) {
    return await prisma.user.count({ where });
  }

  /**
   * Get user with health logs
   */
  static async findWithHealthData(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        sleepLogs: {
          take: 30,
          orderBy: { date: 'desc' },
        },
        activityLogs: {
          take: 30,
          orderBy: { date: 'desc' },
        },
        mealLogs: {
          take: 30,
          orderBy: { date: 'desc' },
        },
      },
    });
  }

  /**
   * Delete user
   */
  static async delete(id) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}

export default UserModel;
