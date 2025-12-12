import CentralUserModel from '../models/centralUserModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getCentralUserController = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await CentralUserModel.findById(parseInt(userId));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

export const listCentralUsersController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const where = {};
  if (req.query.role) {
    where.role = req.query.role;
  }
  if (req.query.isActive !== undefined) {
    where.isActive = req.query.isActive === 'true';
  }

  const users = await CentralUserModel.findMany(where, {
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await CentralUserModel.count(where);

  res.json({
    success: true,
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
