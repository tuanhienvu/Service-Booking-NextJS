import { redirect } from 'next/navigation';
import { getUser } from '@/app/lib/utils/authUtils';
import prisma from '@/app/lib/utils/prisma/database';
import AdminSidebar from '../components/AdminSidebar';
import UsersManagement from './components/UsersManagement';

export const metadata = {
  title: 'Manage Users - Service',
  description: 'Manage users in the Service application',
  keywords: 'admin, users, user management',
};

export default async function AdminUsersPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  if (!['admin', 'super_admin'].includes(user.role || 'user')) {
    redirect('/');
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
      isActive: true,
      created_at: true,
      _count: {
        select: {
          customerReviews: true,
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
          <UsersManagement users={users} currentUser={user} />
        </div>
      </div>
    </div>
  );
}
