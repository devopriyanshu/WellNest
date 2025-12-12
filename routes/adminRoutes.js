import express from 'express';
import {
  createAdmin,
  approveExpert,
  getAllExperts,
  approveCenter,
  getAllCenters,
  getAllUsers,
  deactivateUser,
  activateUser,
  getAuditLogs,
  getDashboardStats,
} from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireRole('admin', 'super_admin'));

// ============================================
// ADMIN MANAGEMENT
// ============================================

// Create new admin (super_admin only)
router.post('/admins', requireRole('super_admin'), createAdmin);

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users with filters
router.get('/users', getAllUsers);

// Deactivate/Activate user
router.patch('/users/:id/deactivate', deactivateUser);
router.patch('/users/:id/activate', activateUser);

// ============================================
// EXPERT MANAGEMENT
// ============================================

// Get all experts with filters
router.get('/experts', getAllExperts);

// Approve/Reject expert
router.patch('/experts/:id/approve', approveExpert);

// ============================================
// CENTER MANAGEMENT
// ============================================

// Get all centers with filters
router.get('/centers', getAllCenters);

// Approve/Reject center
router.patch('/centers/:id/approve', approveCenter);

// ============================================
// AUDIT LOGS
// ============================================

// Get audit logs with filters
router.get('/audit-logs', getAuditLogs);

// ============================================
// DASHBOARD
// ============================================

// Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

export default router;
