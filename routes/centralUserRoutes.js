import { Router } from 'express';
import {
  getCentralUserController,
  listCentralUsersController,
} from '../controllers/centralUserController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Get central user by ID (admin only)
router.get('/:id', authMiddleware, requireRole('admin', 'super_admin'), getCentralUserController);

// List all central users (admin only)
router.get('/', authMiddleware, requireRole('admin', 'super_admin'), listCentralUsersController);

export default router;
