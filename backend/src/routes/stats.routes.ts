import express from 'express';
import { getPublicStats, getAdminStats } from '../controllers/stats.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// Public route for public statistics
router.route('/public')
  .get(getPublicStats);

// Protected route for admin statistics
router.route('/admin')
  .get(protect, authorize('admin'), getAdminStats);

export default router;