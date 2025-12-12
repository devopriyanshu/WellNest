import prisma from '../config/prisma.js';

/**
 * Expert Model - Expert profiles and services
 */
class ExpertModel {
  /**
   * Find expert by ID
   */
  static async findById(id, includeRelations = true) {
    return await prisma.expert.findUnique({
      where: { id },
      include: includeRelations ? {
        expert_qualifications: true,
        expert_specialties: true,
        expert_services: true,
        availability: true,
        expert_faqs: true,
        centralUser: {
          select: {
            email: true,
            isActive: true,
          },
        },
      } : undefined,
    });
  }

  /**
   * Find expert by email
   */
  static async findByEmail(email) {
    return await prisma.expert.findUnique({
      where: { email },
    });
  }

  /**
   * Find expert by central user ID
   */
  static async findByCentralUserId(centralUserId) {
    return await prisma.expert.findFirst({
      where: { user_id: centralUserId },
      include: {
        expert_qualifications: true,
        expert_specialties: true,
        expert_services: true,
        availability: true,
      },
    });
  }

  /**
   * Create expert
   */
  static async create(data) {
    return await prisma.expert.create({
      data,
    });
  }

  /**
   * Update expert
   */
  static async update(id, data) {
    return await prisma.expert.update({
      where: { id },
      data,
    });
  }

  /**
   * List experts with filters
   */
  static async findMany(where = {}, options = {}) {
    const { skip, take, orderBy, include } = options;
    
    return await prisma.expert.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
      include: include || {
        expert_specialties: true,
        expert_services: {
          take: 3,
        },
      },
    });
  }

  /**
   * Count experts
   */
  static async count(where = {}) {
    return await prisma.expert.count({ where });
  }

  /**
   * Get approved experts only
   */
  static async findApproved(options = {}) {
    return await this.findMany(
      { isApproved: true },
      options
    );
  }

  /**
   * Get pending experts
   */
  static async findPending(options = {}) {
    return await this.findMany(
      { isApproved: false, status: 'pending' },
      options
    );
  }

  /**
   * Approve expert
   */
  static async approve(id) {
    return await prisma.expert.update({
      where: { id },
      data: {
        isApproved: true,
        isVerified: true,
        status: 'approved',
      },
    });
  }

  /**
   * Reject expert
   */
  static async reject(id) {
    return await prisma.expert.update({
      where: { id },
      data: {
        isApproved: false,
        status: 'rejected',
      },
    });
  }

  /**
   * Update rating
   */
  static async updateRating(id, rating, totalReviews) {
    return await prisma.expert.update({
      where: { id },
      data: {
        rating,
        totalReviews,
      },
    });
  }

  /**
   * Delete expert
   */
  static async delete(id) {
    return await prisma.expert.delete({
      where: { id },
    });
  }
}

export default ExpertModel;
