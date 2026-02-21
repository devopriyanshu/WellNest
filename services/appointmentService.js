import prisma from '../config/prisma.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const createNewAppointment = async (appointmentData) => {
  const expertId = parseInt(appointmentData.expert_id);
  const userId = parseInt(appointmentData.user_id);

  if (isNaN(expertId) || isNaN(userId)) {
    throw new ValidationError('Invalid expert_id or user_id');
  }

  // Validate expert exists and is approved
  const expert = await prisma.expert.findUnique({
    where: { id: expertId },
  });

  if (!expert) {
    throw new NotFoundError('Expert not found');
  }

  if (!expert.isApproved) {
    throw new ValidationError('Expert is not approved yet');
  }

  // Validate the User profile exists
  const userProfile = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userProfile) {
    throw new ValidationError(
      'Your user profile is not complete. Please update your profile before booking an appointment.'
    );
  }

  // Prevent duplicate active bookings with the same expert
  const existingBooking = await prisma.appointment.findFirst({
    where: {
      userId,
      expertId,
      status: { not: 'cancelled' },
    },
  });

  if (existingBooking) {
    throw new ValidationError(
      'You already have an active appointment with this expert. Please cancel it before booking a new one.'
    );
  }

  // Create appointment with confirmed status
  const appointment = await prisma.appointment.create({
    data: {
      userId,
      expertId,
      appointmentDate: new Date(appointmentData.appointment_date),
      type: appointmentData.type,
      status: 'confirmed',
      notes: appointmentData.notes,
    },
    include: {
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
        },
      },
    },
  });

  logger.info(`Appointment created: ${appointment.id} for user ${userId}`);

  return appointment;
};

export const getAppointmentsByUserId = async (userId) => {
  const appointments = await prisma.appointment.findMany({
    where: { userId: parseInt(userId) },
    include: {
      expert: {
        select: {
          id: true,
          name: true,
          email: true,
          category: true,
          profile_image: true,
          phone: true,
        },
      },
    },
    orderBy: { appointmentDate: 'desc' },
  });

  return appointments;
};

export const getAppointmentsByExpertId = async (expertId) => {
  const appointments = await prisma.appointment.findMany({
    where: { expertId: parseInt(expertId) },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
    orderBy: { appointmentDate: 'desc' },
  });

  return appointments;
};

export const getAppointmentsByUserAndExpert = async (userId, expertId) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      userId: parseInt(userId),
      expertId: parseInt(expertId),
    },
    include: {
      expert: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: { appointmentDate: 'desc' },
  });

  return appointments;
};

export const updateAppointmentStatus = async (appointmentId, status, userId) => {
  // Find appointment
  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(appointmentId) },
  });

  if (!appointment) {
    throw new NotFoundError('Appointment not found');
  }

  // Check if user is authorized (expert or user of the appointment)
  if (appointment.expertId !== userId && appointment.userId !== userId) {
    throw new ForbiddenError('Not authorized to update this appointment');
  }

  const updated = await prisma.appointment.update({
    where: { id: parseInt(appointmentId) },
    data: { status },
    include: {
      expert: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  logger.info(`Appointment ${appointmentId} status updated to ${status}`);

  return updated;
};

export const removeAppointment = async (appointmentId, userId) => {
  // Find appointment
  const appointment = await prisma.appointment.findUnique({
    where: { id: parseInt(appointmentId) },
  });

  if (!appointment) {
    return false;
  }

  // Check if user is authorized (only the user who created it can delete)
  if (appointment.userId !== userId) {
    throw new ForbiddenError('Not authorized to delete this appointment');
  }

  await prisma.appointment.delete({
    where: { id: parseInt(appointmentId) },
  });

  logger.info(`Appointment ${appointmentId} deleted by user ${userId}`);

  return true;
};

export const getUpcomingAppointments = async (userId, role) => {
  const where = {
    appointmentDate: {
      gte: new Date(),
    },
    status: {
      in: ['pending', 'upcoming'],
    },
  };

  if (role === 'expert') {
    where.expertId = userId;
  } else {
    where.userId = userId;
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      expert: {
        select: {
          id: true,
          name: true,
          category: true,
          profile_image: true,
        },
      },
      user: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
    },
    orderBy: { appointmentDate: 'asc' },
    take: 10,
  });

  return appointments;
};
