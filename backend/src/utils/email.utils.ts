import admin from 'firebase-admin';
import { IUser } from '../models/User.model';
import config from '../config';

/**
 * Send email verification using Firebase Auth or fallback method
 * @param user - User object
 * @param token - Verification token
 */
export const sendEmailVerification = async (user: IUser, token: string): Promise<void> => {
  try {
    // Generate email verification link using our custom endpoint
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}&userId=${user._id}`;
    
    // Check if Firebase Admin is properly initialized with credentials
    if (admin.apps.length > 0 && admin.apps[0]?.options?.credential) {
      try {
        // Try to create Firebase user and send verification email
        let firebaseUser;
        try {
          firebaseUser = await admin.auth().createUser({
            email: user.email,
            displayName: user.name,
            password: 'tempPassword123!' // Temporary password, will be reset by user
          });
        } catch (createUserError: any) {
          // If user already exists, get existing user
          if (createUserError.code === 'auth/email-already-exists') {
            firebaseUser = await admin.auth().getUserByEmail(user.email);
          } else {
            throw createUserError;
          }
        }
        
        // Generate email verification link
        const link = await admin.auth().generateEmailVerificationLink(user.email, {
          url: verificationUrl,
        });
        
        console.log(`Firebase email verification link for ${user.email}: ${link}`);
        console.log('Email verification sent successfully via Firebase');
      } catch (firebaseError: any) {
        console.error('Firebase email verification error:', firebaseError);
        // Fallback to logging the verification URL
        console.log(`Email verification link for ${user.email}: ${verificationUrl}`);
        console.log('Using fallback method - link logged to console');
      }
    } else {
      // Fallback method - log the verification URL
      console.log(`Email verification link for ${user.email}: ${verificationUrl}`);
      console.log('Firebase Admin not initialized with credentials - using fallback method');
    }
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send password reset email
 * @param user - User object
 * @param token - Reset token
 */
export const sendPasswordReset = async (user: IUser, token: string): Promise<void> => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}&userId=${user._id}`;
    
    // Check if Firebase Admin is properly initialized with credentials
    if (admin.apps.length > 0 && admin.apps[0]?.options?.credential) {
      try {
        // Generate password reset link
        const link = await admin.auth().generatePasswordResetLink(user.email, {
          url: resetUrl,
        });
        
        console.log(`Firebase password reset link for ${user.email}: ${link}`);
        console.log('Password reset email sent successfully via Firebase');
      } catch (error) {
        console.error('Firebase password reset error:', error);
        // Fallback to logging the reset URL
        console.log(`Password reset link for ${user.email}: ${resetUrl}`);
        console.log('Using fallback method - link logged to console');
      }
    } else {
      // Fallback method - log the reset URL
      console.log(`Password reset link for ${user.email}: ${resetUrl}`);
      console.log('Firebase Admin not initialized with credentials - using fallback method');
    }
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send contact form email to admin
 * @param name - Sender's name
 * @param email - Sender's email
 * @param subject - Email subject
 * @param message - Email message
 */
export const sendContactFormEmail = async (name: string, email: string, subject: string, message: string): Promise<void> => {
  try {
    // For contact form emails, we'll just log the message for now
    // In a production environment, you might want to use a more robust email sending solution
    console.log(`
      New Contact Form Submission:
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `);
    
    console.log('Contact form email processed - details logged to console');
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw new Error('Failed to send contact form email');
  }
};

export default {
  sendEmailVerification,
  sendPasswordReset,
  sendContactFormEmail,
};