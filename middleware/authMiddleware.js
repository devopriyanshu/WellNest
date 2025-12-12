import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { hasPermission } from '../config/permissions.js';
import logger from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_SECRET_KEY);
    
    // Fetch user with role
    const centralUser = await prisma.centralUser.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        users: { select: { id: true } },
        experts: { select: { id: true } },
        centers: { select: { id: true } },
        admins: { select: { id: true } },
      },
    });

    if (!centralUser || !centralUser.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    // Attach user info to request
    req.user = {
      centralUserId: centralUser.id,
      email: centralUser.email,
      role: centralUser.role,
      userId: centralUser.users?.[0]?.id,
      expertId: centralUser.experts?.[0]?.id,
      centerId: centralUser.centers?.[0]?.id,
      adminId: centralUser.admins?.[0]?.id,
      // For backward compatibility with existing code
      id: centralUser.id,
      refId: centralUser.users?.[0]?.id || centralUser.experts?.[0]?.id || centralUser.centers?.[0]?.id || centralUser.admins?.[0]?.id,
    };

    // Update last login
    await prisma.centralUser.update({
      where: { id: centralUser.id },
      data: { lastLogin: new Date() },
    });

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by ${req.user.email} to ${req.originalUrl}`);
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!hasPermission(req.user.role, permission)) {
      logger.warn(`Permission denied: ${req.user.email} attempted ${permission}`);
      return next(new ForbiddenError('Permission denied'));
    }

    next();
  };
};

// Resource ownership check
export const requireOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const resourceId = parseInt(req.params.id);
      const { role, userId, expertId, centerId } = req.user;

      // Super admin bypasses ownership
      if (role === 'super_admin') {
        return next();
      }

      let isOwner = false;

      switch (resourceType) {
        case 'user':
          isOwner = userId === resourceId;
          break;
        case 'expert':
          isOwner = expertId === resourceId;
          break;
        case 'appointment':
          const appointment = await prisma.appointment.findUnique({
            where: { id: resourceId },
            select: { userId: true, expertId: true },
          });
          isOwner = appointment && (
            appointment.userId === userId || 
            appointment.expertId === expertId
          );
          break;
        case 'health_log':
          // Check based on log type
          const logType = req.baseUrl.split('/').pop();
          const logModel = logType === 'sleep' ? 'sleepLog' : 
                          logType === 'activity' ? 'activityLog' : 'mealLog';
          const log = await prisma[logModel].findUnique({
            where: { id: resourceId },
            select: { userId: true },
          });
          isOwner = log && log.userId === userId;
          break;
      }

      if (!isOwner) {
        return next(new ForbiddenError('Not authorized to access this resource'));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Backward compatibility alias
export const authMiddleware = authenticate;

export default {
  authenticate,
  authMiddleware,
  requireRole,
  requirePermission,
  requireOwnership,
};
