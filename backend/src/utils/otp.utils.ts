import * as nodemailer from 'nodemailer';
import { IUser } from '../models/User.model';

/**
 * Generate a random 6-digit OTP
 * @returns 6-digit OTP as string
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP for email verification via SMTP
 * @param user - User object
 * @param otp - One-time password for verification
 */
export const sendEmailVerificationOTP = async (user: IUser, otp: string): Promise<void> => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not configured. Skipping OTP email sending.');
      throw new Error('Email service not configured');
    }

    // Create transporter using SMTP settings from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Email Verification OTP - Ride Pool',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Welcome to Ride Pool!</h2>
          <p>Hello ${user.name},</p>
          <p>Thank you for registering with Ride Pool. Please use the following OTP to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f3f4f6; color: #4f46e5; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; display: inline-block; letter-spacing: 8px;">
              ${otp}
            </div>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't create an account with Ride Pool, please ignore this email.
          </p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP sent successfully to ${user.email}. Message ID: ${info.messageId}`);
  } catch (error: any) {
    console.error('Error sending OTP email:', error.message);
    console.error('SMTP Config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER ? '*** exists ***' : 'MISSING',
      pass: process.env.EMAIL_PASS ? '*** exists ***' : 'MISSING'
    });
    throw new Error('Failed to send verification OTP: ' + error.message);
  }
};

/**
 * Send password reset OTP
 * @param user - User object
 * @param otp - One-time password for reset
 */
export const sendPasswordResetOTP = async (user: IUser, otp: string): Promise<void> => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not configured. Skipping password reset OTP email sending.');
      throw new Error('Email service not configured');
    }

    // Create transporter using SMTP settings from environment variables
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP - Ride Pool',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f3f4f6; color: #4f46e5; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; display: inline-block; letter-spacing: 8px;">
              ${otp}
            </div>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP sent successfully to ${user.email}. Message ID: ${info.messageId}`);
  } catch (error: any) {
    console.error('Error sending password reset OTP email:', error.message);
    console.error('SMTP Config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER ? '*** exists ***' : 'MISSING',
      pass: process.env.EMAIL_PASS ? '*** exists ***' : 'MISSING'
    });
    throw new Error('Failed to send password reset OTP: ' + error.message);
  }
};

export default {
  generateOTP,
  sendEmailVerificationOTP,
  sendPasswordResetOTP,
};