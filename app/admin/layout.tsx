import { getUser } from '@/app/lib/utils/authUtils';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  if (!['admin', 'super_admin'].includes(user.role || 'user')) {
    redirect('/');
  }

  return <>{children}</>;
}
