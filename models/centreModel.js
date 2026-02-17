import prisma from '../config/prisma.js';

/**
 * Center Model - Wellness center management
 */
class CenterModel {
  /**
   * Find center by ID
   */
  static async findById(id, includeRelations = true) {
    return await prisma.center.findUnique({
      where: { id },
      include: includeRelations ? {
        center_addresses: true,
        center_amenities: true,
        center_services: true,
        center_classes: true,
        center_trainers: true,
        center_pricing: true,
        center_images: true,
        center_schedule: true,
        center_faqs: true,
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
   * Find center by email
   */
  static async findByEmail(email) {
    return await prisma.center.findUnique({
      where: { email },
    });
  }

  /**
   * Find center by central user ID
   */
  static async findByCentralUserId(centralUserId) {
    return await prisma.center.findFirst({
      where: { user_id: centralUserId },
      include: {
        center_services: true,
        center_amenities: true,
      },
    });
  }

  /**
   * Create center
   */
  static async create(data) {
    return await prisma.center.create({
      data,
    });
  }

  /**
   * Update center
   */
  static async update(id, data) {
    return await prisma.center.update({
      where: { id },
      data,
    });
  }

  /**
   * List centers with filters
   */
  static async findMany(where = {}, options = {}) {
    const { skip, take, orderBy, include } = options;
    
    return await prisma.center.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
      include: include || {
        center_services: true,
        center_amenities: true,
      },
    });
  }

  /**
   * Count centers
   */
  static async count(where = {}) {
    return await prisma.center.count({ where });
  }

  /**
   * Get approved centers only
   */
  static async findApproved(options = {}) {
    return await this.findMany(
      { isApproved: true },
      options
    );
  }

  /**
   * Get pending centers
   */
  static async findPending(options = {}) {
    return await this.findMany(
      { isApproved: false, status: 'pending' },
      options
    );
  }

  /**
   * Approve center
   */
  static async approve(id) {
    return await prisma.center.update({
      where: { id },
      data: {
        isApproved: true,
        isVerified: true,
        status: 'approved',
      },
    });
  }

  /**
   * Reject center
   */
  static async reject(id) {
    return await prisma.center.update({
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
    return await prisma.center.update({
      where: { id },
      data: {
        rating,
        totalReviews,
      },
    });
  }

  /**
   * Search centers by location
   */
  static async searchByLocation(latitude, longitude, radiusKm = 10) {
    // Simple bounding box search
    const latDelta = radiusKm / 111; // 1 degree latitude ≈ 111 km
    const lonDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

    return await prisma.center.findMany({
      where: {
        isApproved: true,
        latitude: {
          gte: latitude - latDelta,
          lte: latitude + latDelta,
        },
        longitude: {
          gte: longitude - lonDelta,
          lte: longitude + lonDelta,
        },
      },
      include: {
        center_services: true,
        center_amenities: true,
      },
    });
  }

  /**
   * Delete center
   */
  static async delete(id) {
    return await prisma.center.delete({
      where: { id },
    });
  }
}

export default CenterModel;
