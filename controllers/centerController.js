import {
  registerCenterService,
  getCenterService,
  updateCenterService,
  listCentersService,
} from '../services/centreService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const registerCenterController = asyncHandler(async (req, res) => {
  const { body, files } = req;

  // Handle both JSON string (from data field) and direct form data
  let parsedData;
  if (body.data) {
    // If data field exists, parse it as JSON
    parsedData = JSON.parse(body.data);
  } else {
    // Otherwise, use body directly (form fields)
    parsedData = body;
  }

  const profilePicUrl = files?.profilePic ? files.profilePic[0].path : null;
  const backgroundImageUrl = files?.backgroundImage
    ? files.backgroundImage[0].path
    : null;

  const center = await registerCenterService(
    parsedData,
    profilePicUrl,
    backgroundImageUrl
  );

  res.status(201).json({
    success: true,
    message: 'Center registered successfully. Pending admin approval.',
    data: center,
  });
});

export const getCenterController = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);

  const center = await getCenterService(id);

  res.json({
    success: true,
    data: center,
  });
});

export const updateCenterController = asyncHandler(async (req, res) => {
  const centerId = parseInt(req.params.id);
  const updateData = req.body;

  const updatedCenter = await updateCenterService(centerId, updateData);

  res.status(200).json({
    success: true,
    message: 'Center updated successfully',
    data: updatedCenter,
  });
});

export const listCentersController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const filters = {
    search: req.query.search || null,
    sortBy: req.query.sortBy || null,
  };

  const result = await listCentersService(filters, page, limit);

  res.status(200).json({
    success: true,
    data: result.centers,
    meta: result.meta,
    message: 'Centers fetched successfully',
  });
});
