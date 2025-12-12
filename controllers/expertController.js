import {
  getExpertService,
  registerExpertService,
  updateExpertService,
  listExpertsService,
} from '../services/expertService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const registerExpertController = asyncHandler(async (req, res) => {
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

  const expert = await registerExpertService(
    parsedData,
    profilePicUrl,
    backgroundImageUrl
  );

  res.status(201).json({
    success: true,
    message: 'Expert registered successfully. Pending admin approval.',
    data: expert,
  });
});

export const updateExpertController = asyncHandler(async (req, res) => {
  const expertId = parseInt(req.params.id);
  const updateData = req.body;

  const updatedExpert = await updateExpertService(expertId, updateData);
  
  res.status(200).json({
    success: true,
    message: 'Expert updated successfully',
    data: updatedExpert,
  });
});

export const listExpertsController = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const filters = {
    search: req.query.search || null,
    category: req.query.category || null,
    sortBy: req.query.sortBy || null,
  };

  const result = await listExpertsService(filters, page, limit);

  res.status(200).json({
    success: true,
    data: result.experts,
    meta: result.meta,
    message: 'Experts fetched successfully',
  });
});

export const getExpertController = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);

  const expert = await getExpertService(id);
  
  res.json({
    success: true,
    data: expert,
  });
});
