import { Resend } from 'resend';
import { IUser } from '../models/User.model';
import config from '../config';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_YOUR_API_KEY_HERE');

/**
 * Send email verification token
 * @param user - User object
 * @param token - Verification token
 */
export const sendEmailVerification = async (user: IUser, token: string): Promise<void> => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}&userId=${user._id}`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Ride Pool <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Welcome to Ride Pool!</h2>
          <p>Hello ${user.name},</p>
          <p>Thank you for registering with Ride Pool. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4f46e5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;
                      font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't create an account with Ride Pool, please ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('Email verification sent successfully:', data);
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
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Ride Pool <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You have requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4f46e5; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send password reset email');
    }

    console.log('Password reset email sent successfully:', data);
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
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Ride Pool <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || config.services?.email?.contactEmail || 'ridebuddyservices@gmail.com'],
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Message Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 100px;">Name:</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
                <td style="padding: 8px 0;">${subject}</td>
              </tr>
            </table>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="margin-top: 0;">Message:</h3>
            <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This message was sent from the contact form on Ride Pool website.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send contact form email');
    }

    console.log('Contact form email sent successfully:', data);
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