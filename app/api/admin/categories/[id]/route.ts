import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/app/lib/utils/authUtils';
import prisma from '@/app/lib/utils/prisma/database';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['admin', 'super_admin'].includes(user.role || 'user')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: 'Category title is required' }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: parseInt(params.id) },
      data: { title },
    });

    return NextResponse.json({ data: category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const categoryId = parseInt(params.id);

    // Check if category has associated data
    const categoryWithData = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            serviceProviders: true,
            order: true,
          },
        },
      },
    });

    if (!categoryWithData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (categoryWithData._count.serviceProviders > 0 || categoryWithData._count.order > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete category with associated service providers or orders',
        },
        { status: 400 },
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
