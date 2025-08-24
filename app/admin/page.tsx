import { redirect } from 'next/navigation';
import { getUser } from '@/app/lib/utils/authUtils';
import prisma from '@/app/lib/utils/prisma/database';
import AdminDashboard from './components/AdminDashboard';
import AdminSidebar from './components/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard - Service',
  description: 'Admin dashboard for managing Service application',
};

export default async function AdminPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  if (!['admin', 'super_admin'].includes(user.role || 'user')) {
    redirect('/');
  }

  // Get dashboard statistics
  const stats = await Promise.all([
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.serviceProvider.count(),
    prisma.order.count(),
    prisma.category.count(),
    prisma.review.count(),
  ]);

  const dashboardStats = {
    totalUsers: stats[0],
    totalServiceProviders: stats[1],
    totalOrders: stats[2],
    totalCategories: stats[3],
    totalReviews: stats[4],
  };

  return (
    <div className="admin-dashboard min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar user={user} />
        <div className="flex-1 p-6">
          <AdminDashboard user={user} stats={dashboardStats} />
        </div>
      </div>
    </div>
  );
}
