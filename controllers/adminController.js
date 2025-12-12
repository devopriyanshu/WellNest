import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../middleware/errorHandler.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors.js';
import logger from '../utils/logger.js';

// ============================================
// ADMIN MANAGEMENT
// ============================================

// Create admin user
export const createAdmin = asyncHandler(async (req, res) => {
  const { email, password, fullName, phoneNumber, department, permissions } = req.body;

  // Check if user exists
  const existingUser = await prisma.centralUser.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ValidationError('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create central user and admin profile in transaction
  const admin = await prisma.$transaction(async (tx) => {
    const centralUser = await tx.centralUser.create({
      data: {
        email,
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        isActive: true,
        status: 'active',
      },
    });

    const adminProfile = await tx.admin.create({
      data: {
        centralUserId: centralUser.id,
        fullName,
        phoneNumber,
        department,
        permissions: permissions || [],
      },
      include: {
        centralUser: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Log action
    await tx.auditLog.create({
      data: {
        centralUserId: req.user.centralUserId,
        action: 'ADMIN_CREATED',
        resource: 'admin',
        resourceId: adminProfile.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        metadata: { email, fullName },
      },
    });

    return adminProfile;
  });

  logger.info(`Admin created: ${email} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Admin created successfully',
    data: admin,
  });
});

// ============================================
// EXPERT APPROVAL
// ============================================

export const approveExpert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isApproved, isVerified } = req.body;

  const expert = await prisma.expert.update({
    where: { id: parseInt(id) },
    data: {
      isApproved,
      isVerified,
      status: isApproved ? 'approved' : 'pending',
    },
  });

  // Log action
  await prisma.auditLog.create({
    data: {
      centralUserId: req.user.centralUserId,
      action: 'EXPERT_APPROVAL',
      resource: 'expert',
      resourceId: expert.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { isApproved, isVerified, expertEmail: expert.email },
    },
  });

  logger.info(`Expert ${expert.id} ${isApproved ? 'approved' : 'rejected'} by admin ${req.user.email}`);

  res.json({
    success: true,
    message: `Expert ${isApproved ? 'approved' : 'rejected'} successfully`,
    data: expert,
  });
});

// Get all experts with filters
export const getAllExperts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, isApproved, specialization } = req.query;

  const where = {};
  if (status) where.status = status;
  if (isApproved !== undefined) where.isApproved = isApproved === 'true';
  if (specialization) where.category = specialization;

  const [experts, total] = await Promise.all([
    prisma.expert.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        centralUser: {
          select: {
            email: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.expert.count({ where }),
  ]);

  res.json({
    success: true,
    data: experts,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ============================================
// CENTER APPROVAL
// ============================================

export const approveCenter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isApproved, isVerified } = req.body;

  const center = await prisma.center.update({
    where: { id: parseInt(id) },
    data: {
      isApproved,
      isVerified,
      status: isApproved ? 'approved' : 'pending',
    },
  });

  // Log action
  await prisma.auditLog.create({
    data: {
      centralUserId: req.user.centralUserId,
      action: 'CENTER_APPROVAL',
      resource: 'center',
      resourceId: center.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { isApproved, isVerified, centerName: center.name },
    },
  });

  logger.info(`Center ${center.id} ${isApproved ? 'approved' : 'rejected'} by admin ${req.user.email}`);

  res.json({
    success: true,
    message: `Center ${isApproved ? 'approved' : 'rejected'} successfully`,
    data: center,
  });
});

// Get all centers with filters
export const getAllCenters = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, isApproved, category } = req.query;

  const where = {};
  if (status) where.status = status;
  if (isApproved !== undefined) where.isApproved = isApproved === 'true';
  if (category) where.category = category;

  const [centers, total] = await Promise.all([
    prisma.center.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        centralUser: {
          select: {
            email: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.center.count({ where }),
  ]);

  res.json({
    success: true,
    data: centers,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ============================================
// USER MANAGEMENT
// ============================================

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, isActive } = req.query;

  const where = {};
  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const [users, total] = await Promise.all([
    prisma.centralUser.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
          },
        },
        experts: {
          select: {
            id: true,
            name: true,
            category: true,
            isApproved: true,
          },
        },
        centers: {
          select: {
            id: true,
            name: true,
            category: true,
            isApproved: true,
          },
        },
        admins: {
          select: {
            id: true,
            fullName: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.centralUser.count({ where }),
  ]);

  res.json({
    success: true,
    data: users,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// Deactivate user
export const deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.centralUser.update({
    where: { id: parseInt(id) },
    data: { 
      isActive: false,
      status: 'inactive',
    },
  });

  // Log action
  await prisma.auditLog.create({
    data: {
      centralUserId: req.user.centralUserId,
      action: 'USER_DEACTIVATION',
      resource: 'central_user',
      resourceId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { userEmail: user.email },
    },
  });

  logger.info(`User ${user.email} deactivated by admin ${req.user.email}`);

  res.json({
    success: true,
    message: 'User deactivated successfully',
  });
});

// Activate user
export const activateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.centralUser.update({
    where: { id: parseInt(id) },
    data: { 
      isActive: true,
      status: 'active',
    },
  });

  // Log action
  await prisma.auditLog.create({
    data: {
      centralUserId: req.user.centralUserId,
      action: 'USER_ACTIVATION',
      resource: 'central_user',
      resourceId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { userEmail: user.email },
    },
  });

  logger.info(`User ${user.email} activated by admin ${req.user.email}`);

  res.json({
    success: true,
    message: 'User activated successfully',
  });
});

// ============================================
// AUDIT LOGS
// ============================================

export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, action, userId, resource } = req.query;

  const where = {};
  if (action) where.action = action;
  if (userId) where.centralUserId = parseInt(userId);
  if (resource) where.resource = resource;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        centralUser: {
          select: {
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.count({ where }),
  ]);

  res.json({
    success: true,
    data: logs,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ============================================
// DASHBOARD STATS
// ============================================

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalExperts,
    totalCenters,
    pendingExperts,
    pendingCenters,
    activeUsers,
    totalAppointments,
    recentActivity,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.expert.count(),
    prisma.center.count(),
    prisma.expert.count({ where: { isApproved: false } }),
    prisma.center.count({ where: { isApproved: false } }),
    prisma.centralUser.count({ where: { isActive: true } }),
    prisma.appointment.count(),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        centralUser: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      experts: {
        total: totalExperts,
        pending: pendingExperts,
      },
      centers: {
        total: totalCenters,
        pending: pendingCenters,
      },
      appointments: {
        total: totalAppointments,
      },
      recentActivity,
    },
  });
});
