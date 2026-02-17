import prisma from '../config/prisma.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const registerExpertService = async (expertData, profilePicUrl, backgroundImageUrl) => {
  // Parse JSON fields if they're strings (from FormData)
  const qualifications = typeof expertData.qualifications === 'string' 
    ? JSON.parse(expertData.qualifications) 
    : expertData.qualifications;
  
  const specialties = typeof expertData.specialties === 'string'
    ? JSON.parse(expertData.specialties)
    : expertData.specialties;
  
  const services = typeof expertData.services === 'string'
    ? JSON.parse(expertData.services)
    : expertData.services;
  
  const availability = typeof expertData.availability === 'string'
    ? JSON.parse(expertData.availability)
    : expertData.availability;
  
  const faqs = typeof expertData.faqs === 'string'
    ? JSON.parse(expertData.faqs)
    : expertData.faqs;

  // Check if expert email already exists
  const existingExpert = await prisma.expert.findUnique({
    where: { email: expertData.email },
  });

  if (existingExpert) {
    throw new ValidationError('Expert with this email already exists');
  }

  // Create expert with all related data in transaction
  const expert = await prisma.$transaction(async (tx) => {
    // Create expert
    const newExpert = await tx.expert.create({
      data: {
        name: expertData.name,
        email: expertData.email,
        phone: expertData.phone,
        category: expertData.category,
        bio: expertData.bio,
        profile_image: profilePicUrl,
        bg_image: backgroundImageUrl,
        website: expertData.website,
        location: expertData.location,
        languages: expertData.languages || [],
        experience: expertData.experience,
        user_id: expertData.user_id,
        status: 'pending',
        isApproved: false,
        isVerified: false,
      },
    });

    // Create qualifications
    if (qualifications && qualifications.length > 0) {
      await tx.expert_qualifications.createMany({
        data: qualifications.map(q => ({
          expert_id: newExpert.id,
          value: q,
        })),
      });
    }

    // Create specialties
    if (specialties && specialties.length > 0) {
      await tx.expert_specialties.createMany({
        data: specialties.map(s => ({
          expert_id: newExpert.id,
          value: s,
        })),
      });
    }

    // Create services
    if (services && services.length > 0) {
      await tx.expert_services.createMany({
        data: services.map(service => ({
          expert_id: newExpert.id,
          name: service.name,
          format: service.format,
          duration: parseInt(service.duration),
          price: parseFloat(service.price),
        })),
      });
    }

    // Create availability
    if (availability && availability.length > 0) {
      await tx.expertAvailability.createMany({
        data: availability.map(avail => ({
          expertId: newExpert.id,
          day: avail.day,
          selected: avail.selected,
          startTime: avail.startTime ? new Date(avail.startTime) : null,
          endTime: avail.endTime ? new Date(avail.endTime) : null,
        })),
      });
    }

    // Create FAQs
    if (faqs && faqs.length > 0) {
      await tx.expert_faqs.createMany({
        data: faqs.map(faq => ({
          expert_id: newExpert.id,
          question: faq.question,
          answer: faq.answer,
        })),
      });
    }

    return newExpert;
  });

  logger.info(`Expert registered: ${expert.email}`);

  return expert;
};

export const getExpertService = async (expertId) => {
  const expert = await prisma.expert.findUnique({
    where: { id: expertId },
    include: {
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
    },
  });

  if (!expert) {
    throw new NotFoundError('Expert not found');
  }

  return expert;
};

export const updateExpertService = async (expertId, updateData) => {
  const existingExpert = await prisma.expert.findUnique({
    where: { id: expertId },
  });

  if (!existingExpert) {
    throw new NotFoundError('Expert not found');
  }

  const updatedExpert = await prisma.expert.update({
    where: { id: expertId },
    data: {
      name: updateData.name,
      phone: updateData.phone,
      category: updateData.category,
      bio: updateData.bio,
      website: updateData.website,
      location: updateData.location,
      languages: updateData.languages,
      experience: updateData.experience,
      profile_image: updateData.profile_image,
      bg_image: updateData.bg_image,
    },
    include: {
      expert_qualifications: true,
      expert_specialties: true,
      expert_services: true,
      availability: true,
    },
  });

  logger.info(`Expert updated: ${expertId}`);

  return updatedExpert;
};

export const listExpertsService = async (filters = {}, page = 1, limit = 20) => {
  const where = {
    isApproved: true, // Only show approved experts
  };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { bio: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.category) {
    where.category = filters.category;
  }

  let orderBy = { createdAt: 'desc' };
  if (filters.sortBy === 'rating') {
    orderBy = { rating: 'desc' };
  } else if (filters.sortBy === 'experience') {
    orderBy = { experience: 'desc' };
  }

  const [experts, total] = await Promise.all([
    prisma.expert.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        expert_specialties: true,
        expert_services: {
          take: 3, // Limit services for list view
        },
      },
      orderBy,
    }),
    prisma.expert.count({ where }),
  ]);

  return {
    experts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
