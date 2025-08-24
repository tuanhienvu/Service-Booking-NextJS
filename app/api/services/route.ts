import { NextResponse } from 'next/server';
import prisma from '@/app/lib/utils/prisma/database';
import { serviceProviderExtended } from '@/app/lib/interfaces/service';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const limit = searchParams.get('limit');
  const categoryId = searchParams.get('categoryId');
  const categoryName = searchParams.get('categoryName');

  try {
    const serviceProviders = await prisma.serviceProvider.findMany({
      include: {
        category: true,
      },
      take: limit ? parseInt(limit) : undefined,
      where: {
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        category: {
          title: {
            contains: categoryName ? categoryName : undefined,
            mode: 'insensitive',
          },
        },
      },
    });

    // Calculate rating for each service provider
    const servicesWithRating = await Promise.all(
      serviceProviders.map(async (provider) => {
        // Get reviews for this service provider
        const reviews = await prisma.review.findMany({
          where: {
            serviceProviderId: provider.id,
          },
          select: {
            rating: true,
          },
        });

        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        // Get review messages
        const reviewMessages = await prisma.review.findMany({
          where: {
            serviceProviderId: provider.id,
          },
          select: {
            id: true,
            message: true,
            rating: true,
            created_at: true,
          },
        });

        // Count review messages
        const reviewCount = await prisma.review.count({
          where: {
            serviceProviderId: provider.id,
          },
        });

        return {
          ...provider,
          rating: averageRating,
          reviewMessages,
          _count: {
            reviewMessages: reviewCount,
          },
        };
      }),
    );

    return NextResponse.json({ data: servicesWithRating }, { status: 200 });
  } catch (error: any) {
    console.error('Services API error:', error);
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
