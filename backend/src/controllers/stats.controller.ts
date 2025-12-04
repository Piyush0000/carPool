import { Request, Response } from 'express';
import Group from '../models/Group.model';
import User from '../models/User.model';

// @desc    Get public statistics
// @route   GET /api/stats/public
// @access  Public
export const getPublicStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get total groups count
    const totalGroups = await Group.countDocuments();
    
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        totalGroups,
        totalUsers
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Get admin statistics
// @route   GET /api/stats/admin
// @access  Private/Admin
export const getAdminStats = async (req: any, res: Response): Promise<void> => {
  try {
    // Get total groups count
    const totalGroups = await Group.countDocuments();
    
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get active groups (Open status)
    const activeGroups = await Group.countDocuments({ status: 'Open' });
    
    // Get locked groups
    const lockedGroups = await Group.countDocuments({ status: 'Locked' });
    
    // Get completed groups
    const completedGroups = await Group.countDocuments({ status: 'Completed' });
    
    res.status(200).json({
      success: true,
      data: {
        totalGroups,
        totalUsers,
        activeGroups,
        lockedGroups,
        completedGroups
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};