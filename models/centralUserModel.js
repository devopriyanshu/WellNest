import prisma from '../config/prisma.js';

/**
 * CentralUser Model - Core authentication and user management
 */
class CentralUserModel {
  /**
   * Find user by email
   */
  static async findByEmail(email) {
    return await prisma.centralUser.findUnique({
      where: { email },
      include: {
        users: true,
        experts: true,
        centers: true,
        admins: true,
      },
    });
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    return await prisma.centralUser.findUnique({
      where: { id },
      include: {
        users: true,
        experts: true,
        centers: true,
        admins: true,
      },
    });
  }

  /**
   * Find user by Google ID
   */
  static async findByGoogleId(googleId) {
    return await prisma.centralUser.findUnique({
      where: { googleId },
    });
  }

  /**
   * Create new central user
   */
  static async create(data) {
    return await prisma.centralUser.create({
      data,
    });
  }

  /**
   * Update user
   */
  static async update(id, data) {
    return await prisma.centralUser.update({
      where: { id },
      data,
    });
  }

  /**
   * Update last login
   */
  static async updateLastLogin(id) {
    return await prisma.centralUser.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  /**
   * Activate user
   */
  static async activate(id) {
    return await prisma.centralUser.update({
      where: { id },
      data: { 
        isActive: true,
        status: 'active',
      },
    });
  }

  /**
   * Deactivate user
   */
  static async deactivate(id) {
    return await prisma.centralUser.update({
      where: { id },
      data: { 
        isActive: false,
        status: 'inactive',
      },
    });
  }

  /**
   * List users with filters
   */
  static async findMany(where = {}, options = {}) {
    const { skip, take, orderBy } = options;
    
    return await prisma.centralUser.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        users: true,
        experts: true,
        centers: true,
        admins: true,
      },
    });
  }

  /**
   * Count users
   */
  static async count(where = {}) {
    return await prisma.centralUser.count({ where });
  }

  /**
   * Delete user
   */
  static async delete(id) {
    return await prisma.centralUser.delete({
      where: { id },
    });
  }
}

export default CentralUserModel;
