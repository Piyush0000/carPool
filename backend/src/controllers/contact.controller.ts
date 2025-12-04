import { Request, Response } from 'express';
import { sendContactFormEmail } from '../utils/email.utils';

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
      return;
    }

    // Validate email format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
      return;
    }

    // Send email to admin
    await sendContactFormEmail(name, email, subject, message);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.'
    });
  } catch (err: any) {
    console.error('Contact form submission error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to send message. Please try again later.'
    });
  }
};