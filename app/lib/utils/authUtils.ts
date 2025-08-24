'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/utils/prisma/database';
import { headers } from 'next/headers';
import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

// Create JWT token
const createToken = (userId: number, email: string, role: string) => {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
};

// Send email function
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const login = async (data: { email: string; password: string }, redirectUrl?: string) => {
  try {
    // Find user in database
    const user = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        error: 'Account is deactivated. Please contact support.',
      };
    }

    // Verify password
    if (!user.password) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const isValidPassword = await compare(data.password, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Create JWT token
    const token = createToken(user.id, user.email!, user.role!);

    // Set cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Return success with redirect information
    // Use the redirectUrl if provided, otherwise go to home
    const redirectPath = redirectUrl || '/';

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      redirectTo: redirectPath,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'Login failed. Please try again.',
    };
  }
};

export const register = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    if (data.password !== data.confirmPassword) {
      return JSON.stringify({
        error: { message: 'Passwords do not match' },
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existingUser) {
      return JSON.stringify({
        error: { message: 'User with this email already exists' },
      });
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: hashedPassword,
        role: 'customer', // Default role
      },
    });

    // Send welcome email
    const welcomeEmailHtml = `
      <h2>Welcome to Service!</h2>
      <p>Hi ${data.firstName},</p>
      <p>Thank you for registering with Service. Your account has been created successfully.</p>
      <p>You can now log in and start booking services.</p>
      <br>
      <p>Best regards,</p>
      <p>The Service Team</p>
    `;

    await sendEmail(data.email, 'Welcome to Service!', welcomeEmailHtml);

    return JSON.stringify({ success: true, user });
  } catch (error: any) {
    return JSON.stringify({
      error: { message: 'Registration failed. Please try again.' },
    });
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (!user) {
      return JSON.stringify({
        error: { message: 'If an account with this email exists, you will receive a password reset email.' },
      });
    }

    // Create reset token
    const resetToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Store reset token in user record (you might want to add a resetToken field to your user model)
    // For now, we'll just send the email

    const resetEmailHtml = `
      <h2>Password Reset Request</h2>
      <p>Hi ${user.first_name},</p>
      <p>You requested a password reset for your Service account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${process.env.NEXT_PUBLIC_HOST}/reset-password?token=${resetToken}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this reset, please ignore this email.</p>
      <br>
      <p>Best regards,</p>
      <p>The Service Team</p>
    `;

    await sendEmail(data.email, 'Password Reset Request - Service', resetEmailHtml);

    return JSON.stringify({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset email.',
    });
  } catch (error: any) {
    return JSON.stringify({
      error: { message: 'Password reset request failed. Please try again.' },
    });
  }
};

export const resetPassword = async (data: { password: string; confirmPassword: string }, token: string) => {
  try {
    if (data.password !== data.confirmPassword) {
      return JSON.stringify({
        error: { message: 'Passwords do not match' },
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return JSON.stringify({
        error: { message: 'Invalid or expired reset token' },
      });
    }

    // Hash new password
    const hashedPassword = await hash(data.password, 12);

    // Update user password
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    return JSON.stringify({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    return JSON.stringify({
      error: { message: 'Password reset failed. Please try again.' },
    });
  }
};

export const updatePassword = async (data: { password: string; confirmPassword: string }) => {
  try {
    if (data.password !== data.confirmPassword) {
      return JSON.stringify({
        error: { message: 'Passwords do not match' },
      });
    }

    // Get current user from token
    const token = cookies().get('auth-token')?.value;
    if (!token) {
      return JSON.stringify({
        error: { message: 'Not authenticated' },
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return JSON.stringify({
        error: { message: 'Invalid token' },
      });
    }

    // Hash new password
    const hashedPassword = await hash(data.password, 12);

    // Update user password
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    return JSON.stringify({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    return JSON.stringify({
      error: { message: 'Password update failed. Please try again.' },
    });
  }
};

export const logout = async () => {
  try {
    // Get user ID before clearing cookie for cache clearing
    let userId: number | undefined;
    try {
      const token = cookies().get('auth-token')?.value;
      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          userId = decoded.userId;
        }
      }
    } catch (error) {
      // Ignore errors when getting user ID
    }

    // Clear auth cookie
    cookies().delete('auth-token');

    // Clear user cache
    if (userId) {
      clearUserCache(userId);
    }

    revalidatePath('/', 'layout');
    redirect('/login');
  } catch (error: any) {
    redirect('/login');
  }
};

export const logoutAdmin = async () => {
  try {
    // Clear auth cookie
    cookies().delete('auth-token');

    // Clear any admin-specific session data
    revalidatePath('/', 'layout');
    redirect('/login');
  } catch (error: any) {
    redirect('/login');
  }
};

// Simple in-memory cache for user data
const userCache = new Map<string, { user: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Function to clear user cache
export const clearUserCache = (userId?: number) => {
  if (userId) {
    userCache.delete(`user_${userId}`);
  } else {
    userCache.clear();
  }
};

export const getUser = async () => {
  try {
    // Check if we're in a server context where cookies are available
    let token;
    try {
      token = cookies().get('auth-token')?.value;
    } catch (cookieError) {
      // If cookies are not available, return null
      return null;
    }

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Check cache first
    const cacheKey = `user_${decoded.userId}`;
    const cached = userCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.user;
    }

    // Add error handling for the Prisma query
    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          first_name: true,
          last_name: true,
          imageUrl: true,
          isActive: true,
          created_at: true,
        },
      });

      if (user) {
        // Cache the user data
        userCache.set(cacheKey, { user, timestamp: Date.now() });
      }

      return user;
    } catch (prismaError) {
      // Prisma error - return null
      return null;
    }
  } catch (error) {
    // General error - return null
    return null;
  }
};

export const getSession = async () => {
  try {
    // Check if we're in a server context where cookies are available
    let token;
    try {
      token = cookies().get('auth-token')?.value;
    } catch (cookieError) {
      // If cookies are not available, return null
      return null;
    }

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Add error handling for the Prisma query
    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return null;
      }

      return {
        user: {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
        },
      };
    } catch (prismaError) {
      // Prisma error - return null
      return null;
    }
  } catch (error) {
    // General error - return null
    return null;
  }
};

// Send notification email
export const sendNotificationEmail = async (userId: number, type: string, message: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      return { success: false, error: 'User not found or no email' };
    }

    let subject = '';
    let emailHtml = '';

    switch (type) {
      case 'booking_request':
        subject = 'New Booking Request - Service';
        emailHtml = `
          <h2>New Booking Request</h2>
          <p>Hi ${user.first_name},</p>
          <p>You have received a new booking request.</p>
          <p><strong>Message:</strong> ${message}</p>
          <p>Please log in to your dashboard to review and respond to this request.</p>
          <br>
          <p>Best regards,</p>
          <p>The Service Team</p>
        `;
        break;
      case 'booking_confirmed':
        subject = 'Booking Confirmed - Service';
        emailHtml = `
          <h2>Booking Confirmed</h2>
          <p>Hi ${user.first_name},</p>
          <p>Your booking has been confirmed!</p>
          <p><strong>Details:</strong> ${message}</p>
          <p>We'll send you updates about your service.</p>
          <br>
          <p>Best regards,</p>
          <p>The Service Team</p>
        `;
        break;
      case 'booking_completed':
        subject = 'Service Completed - Service';
        emailHtml = `
          <h2>Service Completed</h2>
          <p>Hi ${user.first_name},</p>
          <p>Your service has been completed!</p>
          <p><strong>Details:</strong> ${message}</p>
          <p>Please leave a review to help other customers.</p>
          <br>
          <p>Best regards,</p>
          <p>The Service Team</p>
        `;
        break;
      default:
        subject = 'Notification - Service';
        emailHtml = `
          <h2>Notification</h2>
          <p>Hi ${user.first_name},</p>
          <p>${message}</p>
          <br>
          <p>Best regards,</p>
          <p>The Service Team</p>
        `;
    }

    await sendEmail(user.email, subject, emailHtml);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
