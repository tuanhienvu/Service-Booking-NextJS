import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/app/lib/utils/prisma/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(req: NextRequest) {
  try {
    // Get auth token from cookies
    const token = cookies().get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || decoded.role !== 'customer') {
      return NextResponse.json({ error: 'Only customers can book services' }, { status: 403 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.serviceProviderId || !body.categoryId || !body.date || !body.time || !body.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId: decoded.userId,
        serviceProviderId: body.serviceProviderId,
        categoryId: body.categoryId,
        date: body.date,
        time: body.time,
        location: body.location,
        notes: body.notes || '',
        amount: body.amount,
        status: 'Pending',
        scheduledDate: new Date(body.date + 'T' + body.time),
      },
    });

    // Create order services
    await prisma.orderServices.create({
      data: {
        orderId: order.id,
        title: body.serviceTitle || 'Service Booking',
        quantity: body.duration || 1,
      },
    });

    // Create notification for service provider
    await prisma.notification.create({
      data: {
        userId: body.serviceProviderId,
        orderId: order.id,
        type: 'new_booking',
        message: `New booking request for ${body.date} at ${body.time}`,
        isRead: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Booking created successfully',
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
