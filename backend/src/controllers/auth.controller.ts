import { Request, Response } from 'express';
import User from '../models/User.model';
import { hashPassword, comparePassword, sendTokenResponse } from '../utils/auth.utils';
import { generateOTP, sendEmailVerificationOTP } from '../utils/otp.utils';
import crypto from 'crypto';
import { verifyFirebaseIdToken } from '../services/firebase-admin.service';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, gender, year, branch } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
      return;
    }

    // Validate email format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      res.status(400).json({
        success: false,
        message: 'Please enter a valid email'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user - only include fields that have values
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isEmailVerified: false
    };

    // Only add optional fields if they have values
    // For phone, only add if it's provided and not empty
    if (phone && phone.trim() !== '' && phone.trim() !== 'N/A') {
      userData.phone = phone.trim();
    }
    if (gender) userData.gender = gender;
    if (year) userData.year = year;
    if (branch) userData.branch = branch;

    const user = await User.create(userData);

    // Send OTP email (don't fail registration if email fails)
    try {
      await sendEmailVerificationOTP(user, otp);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email for OTP.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        }
      });
    } catch (emailError) {
      console.error('OTP sending failed:', emailError);
      // Still return success but with different message
      res.status(201).json({
        success: true,
        message: 'User registered successfully. OTP delivery may be delayed.',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        }
      });
    }
  } catch (err: any) {
    console.error('Registration error:', err);
    // Handle duplicate key errors specifically
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      res.status(400).json({
        success: false,
        message: `A user with this ${field} already exists`
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-email-otp
// @access  Public
export const verifyEmailWithOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Validate email and OTP
    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
      return;
    }

    // Find user with matching email and OTP
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
      return;
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (err: any) {
    console.error('Email verification error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check if user is already verified
    if (user.isEmailVerified) {
      res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
      return;
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    try {
      await sendEmailVerificationOTP(user, otp);
      
      res.status(200).json({
        success: true,
        message: 'OTP resent successfully. Please check your email.'
      });
    } catch (emailError) {
      console.error('OTP resending failed:', emailError);
      res.status(500).json({
        success: false,
        message: 'Failed to resend OTP. Please try again later.'
      });
    }
  } catch (err: any) {
    console.error('OTP resend error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
      return;
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if password matches
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err: any) {
    console.error('Get me error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Verify email (legacy endpoint - kept for backward compatibility)
// @route   GET /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, userId, oobCode, mode, continueUrl } = req.query;

    // Handle Firebase email verification
    if (oobCode && mode === 'verifyEmail') {
      // For Firebase verification, we need to extract the email from the continueUrl
      // The continueUrl contains our custom verification parameters
      if (continueUrl && typeof continueUrl === 'string') {
        try {
          const url = new URL(continueUrl);
          const searchParams = new URLSearchParams(url.search);
          const tokenParam = searchParams.get('token');
          const userIdParam = searchParams.get('userId');
          
          // If we have token and userId in the continueUrl, use the custom verification flow
          if (tokenParam && userIdParam) {
            // Find user with matching token and expiration
            const user = await User.findOne({
              _id: userIdParam,
              emailVerificationToken: tokenParam,
              emailVerificationExpires: { $gt: Date.now() }
            });

            if (!user) {
              res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
              });
              return;
            }

            // Update user as verified
            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();

            res.status(200).json({
              success: true,
              message: 'Email verified successfully'
            });
            return;
          }
        } catch (urlError) {
          console.error('Error parsing continueUrl:', urlError);
        }
      }
      
      // If we can't extract token and userId from continueUrl, 
      // we'll assume the Firebase flow has already verified the email
      // and just return success
      res.status(200).json({
        success: true,
        message: 'Email verified successfully through Firebase'
      });
      return;
    }

    // Handle custom verification with token and userId
    if (token && userId) {
      // Find user with matching token and expiration
      const user = await User.findOne({
        _id: userId,
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() }
      });

      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
        return;
      }

      // Update user as verified
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Email verified successfully'
      });
      return;
    }

    // If neither approach works, return an error
    res.status(400).json({
      success: false,
      message: 'Invalid verification link'
    });
  } catch (err: any) {
    console.error('Email verification error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

// @desc    Firebase authentication
// @route   POST /api/auth/firebase
// @access  Public
export const firebaseAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    console.log('Firebase auth request received:', { 
      hasIdToken: !!idToken,
      idTokenLength: idToken ? idToken.length : 0
    });

    if (!idToken) {
      res.status(400).json({
        success: false,
        message: 'ID token is required'
      });
      return;
    }

    // Verify Firebase ID token
    console.log('Attempting to verify Firebase ID token...');
    const decodedToken = await verifyFirebaseIdToken(idToken);
    console.log('Firebase token verified successfully:', {
      hasEmail: !!decodedToken.email,
      hasPhone: !!decodedToken.phone_number,
      email: decodedToken.email,
      phone: decodedToken.phone_number
    });
    
    // Extract email from decoded token with multiple fallback options
    let email: string | undefined;
    let name: string | undefined;
    let phone: string | undefined;
    
    // Try different possible locations for email, name, and phone
    if (decodedToken.email) {
      email = decodedToken.email;
    } else if (decodedToken.payload?.email) {
      email = decodedToken.payload.email;
    } else if (decodedToken.firebase?.identities?.email?.[0]) {
      email = decodedToken.firebase.identities.email[0];
    }
    
    if (decodedToken.name) {
      name = decodedToken.name;
    } else if (decodedToken.displayName) {
      name = decodedToken.displayName;
    } else if (decodedToken.payload?.name) {
      name = decodedToken.payload.name;
    } else if (decodedToken.payload?.displayName) {
      name = decodedToken.payload.displayName;
    }
    
    // Try to get phone from Firebase token if available
    if (decodedToken.phone_number) {
      phone = decodedToken.phone_number;
    }
    
    console.log('Firebase token decoded - Email:', email, 'Phone:', phone);
    
    if (!email) {
      console.error('Invalid Firebase token - missing email. Decoded token structure:', JSON.stringify(decodedToken, null, 2));
      res.status(400).json({
        success: false,
        message: 'Invalid Firebase token: missing email'
      });
      return;
    }
    
    // Check if user exists in our database
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if they don't exist
      const userName = name || email.split('@')[0] || 'Firebase User';
      
      // Prepare user data without default values
      const userData: any = {
        name: userName,
        email,
        password: await hashPassword(crypto.randomBytes(20).toString('hex')),
        isEmailVerified: true, // Firebase users are already verified
        emailVerificationToken: undefined,
        emailVerificationExpires: undefined
      };
      
      // Debug log
      console.log('Creating new user with data:', userData);
      console.log('Phone value:', phone, 'Phone type:', typeof phone);
      
      // Only add phone if it's provided and not empty
      if (phone && phone.trim() !== '' && phone.trim() !== 'N/A') {
        userData.phone = phone.trim();
        console.log('Adding phone to user data:', phone.trim());
      } else {
        console.log('Not adding phone to user data - phone is null/empty');
      }
      
      user = await User.create(userData);
      console.log('User created successfully:', user.email);
    } else if (!user.isEmailVerified) {
      // Update user as verified if they weren't already
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();
      console.log('Existing user updated as verified:', user.email);
    }

    // Send token response with proper user data structure
    console.log('Sending successful auth response for:', user.email);
    sendTokenResponse(user, 200, res);
  } catch (err: any) {
    console.error('Firebase auth error:', err);
    console.error('Error stack:', err.stack);
    res.status(401).json({
      success: false,
      message: 'Firebase authentication failed: ' + (err.message || 'Unknown error')
    });
  }
};