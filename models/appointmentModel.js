import prisma from '../config/prisma.js';

/**
 * Appointment Model - Appointment management
 */
class AppointmentModel {
  /**
   * Find appointment by ID
   */
  static async findById(id, includeRelations = true) {
    return await prisma.appointment.findUnique({
      where: { id },
      include: includeRelations ? {
        expert: {
          select: {
            id: true,
            name: true,
            email: true,
            category: true,
            profile_image: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      } : undefined,
    });
  }

  /**
   * Create appointment
   */
  static async create(data) {
    return await prisma.appointment.create({
      data,
      include: {
        expert: true,
        user: true,
      },
    });
  }

  /**
   * Update appointment
   */
  static async update(id, data) {
    return await prisma.appointment.update({
      where: { id },
      data,
    });
  }

  /**
   * Update status
   */
  static async updateStatus(id, status) {
    return await prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Find by user ID
   */
  static async findByUserId(userId, options = {}) {
    const { skip, take, orderBy } = options;
    
    return await prisma.appointment.findMany({
      where: { userId },
      skip,
      take,
      orderBy: orderBy || { appointmentDate: 'desc' },
      include: {
        expert: {
          select: {
            id: true,
            name: true,
            category: true,
            profile_image: true,
          },
        },
      },
    });
  }

  /**
   * Find by expert ID
   */
  static async findByExpertId(expertId, options = {}) {
    const { skip, take, orderBy } = options;
    
    return await prisma.appointment.findMany({
      where: { expertId },
      skip,
      take,
      orderBy: orderBy || { appointmentDate: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
          },
        },
      },
    });
  }

  /**
   * Find upcoming appointments
   */
  static async findUpcoming(userId, role = 'user') {
    const where = {
      appointmentDate: { gte: new Date() },
      status: { in: ['pending', 'upcoming'] },
    };

    if (role === 'expert') {
      where.expertId = userId;
    } else {
      where.userId = userId;
    }

    return await prisma.appointment.findMany({
      where,
      orderBy: { appointmentDate: 'asc' },
      take: 10,
      include: {
        expert: true,
        user: true,
      },
    });
  }

  /**
   * Find past appointments
   */
  static async findPast(userId, role = 'user') {
    const where = {
      appointmentDate: { lt: new Date() },
    };

    if (role === 'expert') {
      where.expertId = userId;
    } else {
      where.userId = userId;
    }

    return await prisma.appointment.findMany({
      where,
      orderBy: { appointmentDate: 'desc' },
      take: 20,
      include: {
        expert: true,
        user: true,
      },
    });
  }

  /**
   * Count appointments
   */
  static async count(where = {}) {
    return await prisma.appointment.count({ where });
  }

  /**
   * Delete appointment
   */
  static async delete(id) {
    return await prisma.appointment.delete({
      where: { id },
    });
  }
}

export default AppointmentModel;
