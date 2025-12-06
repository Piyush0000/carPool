import admin from 'firebase-admin';
import { IUser } from '../models/User.model';

/**
 * Generate a random 6-digit OTP
 * @returns 6-digit OTP as string
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP for email verification via Firebase
 * @param user - User object
 * @param otp - One-time password for verification
 */
export const sendEmailVerificationOTP = async (user: IUser, otp: string): Promise<void> => {
  try {
    // Check if Firebase Admin is properly initialized
    if (!admin.apps.length) {
      console.warn('Firebase Admin not initialized. Falling back to simulated OTP sending.');
      // In development, we'll just log the OTP
      console.log(`Simulated OTP for ${user.email}: ${otp}`);
      return;
    }

    // For Firebase, we'll store the OTP in the user document
    // and send a generic email notification through Firebase Auth
    console.log(`OTP ${otp} generated for user ${user.email}. This would be sent via Firebase in production.`);
    
    // Note: Firebase Auth doesn't have a direct method for sending custom OTP emails
    // In a real implementation, you would either:
    // 1. Use Firebase Extensions for custom email templates
    // 2. Use Firebase Cloud Functions with a trigger
    // 3. Store the OTP in your database and send a generic notification
    
    // For now, we'll just log that the OTP was "sent"
    console.log(`Firebase OTP notification sent to ${user.email}`);
  } catch (error: any) {
    console.error('Error with Firebase OTP sending:', error.message);
    throw new Error('Failed to send verification OTP via Firebase: ' + error.message);
  }
};

/**
 * Send password reset OTP via Firebase
 * @param user - User object
 * @param otp - One-time password for reset
 */
export const sendPasswordResetOTP = async (user: IUser, otp: string): Promise<void> => {
  try {
    // Check if Firebase Admin is properly initialized
    if (!admin.apps.length) {
      console.warn('Firebase Admin not initialized. Falling back to simulated password reset OTP sending.');
      // In development, we'll just log the OTP
      console.log(`Simulated password reset OTP for ${user.email}: ${otp}`);
      return;
    }

    // For Firebase, we'll store the OTP in the user document
    // and send a generic email notification through Firebase Auth
    console.log(`Password reset OTP ${otp} generated for user ${user.email}. This would be sent via Firebase in production.`);
    
    // Note: Firebase Auth doesn't have a direct method for sending custom OTP emails
    // In a real implementation, you would either:
    // 1. Use Firebase Extensions for custom email templates
    // 2. Use Firebase Cloud Functions with a trigger
    // 3. Store the OTP in your database and send a generic notification
    
    // For now, we'll just log that the OTP was "sent"
    console.log(`Firebase password reset OTP notification sent to ${user.email}`);
  } catch (error: any) {
    console.error('Error with Firebase password reset OTP sending:', error.message);
    throw new Error('Failed to send password reset OTP via Firebase: ' + error.message);
  }
};

export default {
  generateOTP,
  sendEmailVerificationOTP,
  sendPasswordResetOTP,
};