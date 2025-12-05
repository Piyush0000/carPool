import { Request, Response } from 'express';
import User, { IUser } from '../models/User.model';
import { hashPassword } from '../utils/auth.utils';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Get user count (public endpoint)
// @route   GET /api/users/count
// @access  Public
export const getUserCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      count: count
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Handle phone field to prevent null values
    if (req.body.phone) {
      if (req.body.phone === null || req.body.phone === undefined || 
          req.body.phone === '' || req.body.phone === 'N/A') {
        delete req.body.phone;
      } else {
        req.body.phone = req.body.phone.trim();
      }
    }
    
    const user = await User.create(req.body);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req: any, res: Response): Promise<void> => {
  try {
    // Check if user is updating their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
      return;
    }

    // Handle password update separately
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }
    
    // Handle phone field to prevent null values
    let updateData = { ...req.body };
    if ('phone' in req.body) {
      if (req.body.phone === null || req.body.phone === undefined || 
          req.body.phone === '' || req.body.phone === 'N/A') {
        // Remove phone field if it's null/empty
        updateData.$unset = { phone: "" };
        delete updateData.phone;
      } else {
        // Trim phone if it has a value
        updateData.phone = req.body.phone.trim();
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Update user location
// @route   PUT /api/users/location
// @access  Private
export const updateUserLocation = async (req: any, res: Response): Promise<void> => {
  try {
    const { coordinates } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { liveLocation: { coordinates } },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};