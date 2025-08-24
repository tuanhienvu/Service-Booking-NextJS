import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { clearUserCache } from '@/app/lib/utils/authUtils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    // Clear the auth cookie regardless of whether token exists
    cookieStore.delete('auth-token');

    if (!token) {
      return NextResponse.json({
        success: true,
        message: 'Logged out successfully (no token found)',
      });
    }

    // Verify token to get user info (optional)
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Clear user cache
      if (decoded.userId) {
        clearUserCache(decoded.userId);
      }
    } catch (jwtError) {
      // Invalid token, but we already cleared it
      // Continue with logout process
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    // Always try to clear the cookie even on error
    try {
      const cookieStore = cookies();
      cookieStore.delete('auth-token');
    } catch (clearError) {
      // Failed to clear cookie on error
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Logout failed, but session cleared',
      },
      { status: 500 },
    );
  }
}
