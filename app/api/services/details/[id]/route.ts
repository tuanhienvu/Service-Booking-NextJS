import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/utils/prisma/database';
import { serviceProviderExtended } from '@/app/lib/interfaces/service';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({ data: { message: 'Id is required', type: 'Error' } }, { status: 400 });
  }

  if (isNaN(Number(params.id))) {
    return NextResponse.json({ data: { message: 'Id must be a number', type: 'Error' } }, { status: 400 });
  }

  try {
    const response = await prisma.serviceProvider
      .findUnique({
        where: {
          id: Number(params.id),
        },
        include: {
          category: true,
        },
      });

    if (!response) {
      return NextResponse.json({ data: { message: 'Service provider not found.', type: 'Error' } }, { status: 404 });
    }

    return NextResponse.json(
      {
        data: response,
      },
      { status: 200 },
    );
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
