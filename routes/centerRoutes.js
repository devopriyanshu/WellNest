import { Router } from 'express';
import {
  registerCenterController,
  getCenterController,
  updateCenterController,
  listCentersController,
} from '../controllers/centerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../middleware/cloudinaryUpload.js';

const router = Router();

// Register new center
router.post(
  '/register',
  authMiddleware,
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
  ]),
  registerCenterController
);

// List centers
router.get('/', listCentersController);

// Get center by ID
router.get('/:id', getCenterController);

// Update center
router.put('/:id', authMiddleware, updateCenterController);

export default router;
