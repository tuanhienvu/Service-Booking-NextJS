import { redirect } from 'next/navigation';
import { getUser } from '@/app/lib/utils/authUtils';
import prisma from '@/app/lib/utils/prisma/database';
import AdminSidebar from '../components/AdminSidebar';
import CategoriesManagement from './components/CategoriesManagement';

export const metadata = {
  title: 'Manage Categories - Service',
  description: 'Manage service categories in the Service application',
  keywords: 'admin, categories, service management',
};

export default async function AdminCategoriesPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  if (!['admin', 'super_admin'].includes(user.role || 'user')) {
    redirect('/');
  }

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          serviceProviders: true,
          order: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className="admin-dashboard min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar user={user} />
        <div className="flex-1 p-6">
          <CategoriesManagement categories={categories} />
        </div>
      </div>
    </div>
  );
}
