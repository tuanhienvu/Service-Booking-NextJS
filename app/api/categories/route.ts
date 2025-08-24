import { NextResponse } from 'next/server';
import prisma from '@/app/lib/utils/prisma/database';

// Simple in-memory cache for categories
let categoriesCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  try {
    // Check cache first
    if (categoriesCache && Date.now() - categoriesCache.timestamp < CACHE_TTL) {
      return NextResponse.json({ data: categoriesCache.data }, { status: 200 });
    }

    // Fetch from database
    const response = await prisma.category.findMany({
      select: {
        id: true,
        title: true,
        created_at: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    // Update cache
    categoriesCache = {
      data: response,
      timestamp: Date.now(),
    };

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: {
          message: error.message,
          type: error.constructor.name,
        },
      },
      { status: 500 },
    );
  }
}
