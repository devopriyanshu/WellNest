import prisma from '../config/prisma.js';
import CenterModel from '../models/centreModel.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const registerCenterService = async (centerData, profilePicUrl, backgroundImageUrl) => {
  // Parse JSON fields if they're strings (from FormData)
  const amenities = typeof centerData.amenities === 'string'
    ? JSON.parse(centerData.amenities)
    : centerData.amenities;
  
  const equipment = typeof centerData.equipment === 'string'
    ? JSON.parse(centerData.equipment)
    : centerData.equipment;
  
  const services = typeof centerData.services === 'string'
    ? JSON.parse(centerData.services)
    : centerData.services;
  
  const trainers = typeof centerData.trainers === 'string'
    ? JSON.parse(centerData.trainers)
    : centerData.trainers;
  
  const pricing = typeof centerData.pricing === 'string'
    ? JSON.parse(centerData.pricing)
    : centerData.pricing;
  
  const schedule = typeof centerData.schedule === 'string'
    ? JSON.parse(centerData.schedule)
    : centerData.schedule;

  // Check if center email already exists
  const existingCenter = await CenterModel.findByEmail(centerData.email);

  if (existingCenter) {
    throw new ValidationError('Center with this email already exists');
  }

  // Create center with all related data in transaction
  const center = await prisma.$transaction(async (tx) => {
    // Log the data we're trying to create for debugging
    const createData = {
      name: centerData.name,
      email: centerData.email,
      phone: centerData.phone,
      category: centerData.category,
      description: centerData.description,
      address: centerData.address,
      centerImage: profilePicUrl, // Use centerImage instead of profile_image
      website: centerData.website,
      latitude: centerData.latitude ? parseFloat(centerData.latitude) : null,
      longitude: centerData.longitude ? parseFloat(centerData.longitude) : null,
      user_id: centerData.user_id,
      status: 'pending',
      isApproved: false,
      isVerified: false,
    };
    
    logger.info('Creating center with data:', createData);
    
    // Create center
    const newCenter = await tx.center.create({
      data: createData,
    });

    // Create addresses
    if (centerData.addresses && centerData.addresses.length > 0) {
      await tx.center_addresses.createMany({
        data: centerData.addresses.map(addr => ({
          center_id: newCenter.id,
          value: addr,
        })),
      });
    }

    // Create amenities
    if (amenities && amenities.length > 0) {
      await tx.center_amenities.createMany({
        data: amenities.map(amenity => ({
          center_id: newCenter.id,
          value: amenity,
        })),
      });
    }

    // Create equipment
    if (equipment && equipment.length > 0) {
      await tx.center_equipment.createMany({
        data: equipment.map(equip => ({
          center_id: newCenter.id,
          value: equip,
        })),
      });
    }

    // Create services
    if (services && services.length > 0) {
      await tx.center_services.createMany({
        data: services.map(service => ({
          center_id: newCenter.id,
          value: service,
        })),
      });
    }

    // Create classes
    if (centerData.classes && centerData.classes.length > 0) {
      await tx.center_classes.createMany({
        data: centerData.classes.map(cls => ({
          center_id: newCenter.id,
          name: cls.name,
          description: cls.description,
          schedule: cls.schedule,
        })),
      });
    }

    // Create trainers
    if (trainers && trainers.length > 0) {
      await tx.center_trainers.createMany({
        data: trainers.map(trainer => ({
          center_id: newCenter.id,
          name: trainer.name,
          specialization: trainer.specialization,
          bio: trainer.bio,
        })),
      });
    }

    // Create pricing
    if (pricing && pricing.length > 0) {
      await tx.center_pricing.createMany({
        data: pricing.map(price => ({
          center_id: newCenter.id,
          plan_name: price.planName,
          price: parseFloat(price.price),
          duration: price.duration,
        })),
      });
    }

    // Create schedule
    if (schedule && schedule.length > 0) {
      await tx.center_schedule.createMany({
        data: schedule.map(sched => ({
          center_id: newCenter.id,
          day_of_week: sched.day,
          is_open: sched.isOpen,
          opening_time: sched.openingTime ? new Date(sched.openingTime) : null,
          closing_time: sched.closingTime ? new Date(sched.closingTime) : null,
        })),
      });
    }

    // Create FAQs
    if (centerData.faqs && centerData.faqs.length > 0) {
      await tx.center_faqs.createMany({
        data: centerData.faqs.map(faq => ({
          center_id: newCenter.id,
          question: faq.question,
          answer: faq.answer,
        })),
      });
    }

    return newCenter;
  });

  logger.info(`Center registered: ${center.email}`);

  return center;
};

export const getCenterService = async (centerId) => {
  const center = await CenterModel.findById(centerId, true);

  if (!center) {
    throw new NotFoundError('Center not found');
  }

  return center;
};

export const updateCenterService = async (centerId, updateData) => {
  const existingCenter = await CenterModel.findById(centerId, false);

  if (!existingCenter) {
    throw new NotFoundError('Center not found');
  }

  const updatedCenter = await CenterModel.update(centerId, {
    name: updateData.name,
    phone: updateData.phone,
    description: updateData.description,
    website: updateData.website,
    latitude: updateData.latitude ? parseFloat(updateData.latitude) : undefined,
    longitude: updateData.longitude ? parseFloat(updateData.longitude) : undefined,
    profile_image: updateData.profile_image,
    bg_image: updateData.bg_image,
  });

  logger.info(`Center updated: ${centerId}`);

  return updatedCenter;
};

export const listCentersService = async (filters = {}, page = 1, limit = 20) => {
  const where = {
    isApproved: true, // Only show approved centers
  };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  let orderBy = { createdAt: 'desc' };
  if (filters.sortBy === 'rating') {
    orderBy = { rating: 'desc' };
  }

  const [centers, total] = await Promise.all([
    prisma.center.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        center_services: true,
        center_amenities: true,
      },
      orderBy,
    }),
    prisma.center.count({ where }),
  ]);

  return {
    centers,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
