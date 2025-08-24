import { redirect } from 'next/navigation';
import { getUser } from '@/app/lib/utils/authUtils';
import prisma from '@/app/lib/utils/prisma/database';
import ProviderBookings from './components/ProviderBookings';

export const metadata = {
  title: 'My Bookings - Service Provider Dashboard',
  description: 'View and manage your service bookings',
};

const ProviderBookingsPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'service_provider') {
    redirect('/');
  }

  // Get provider's bookings
  const bookings = await prisma.order.findMany({
    where: {
      serviceProviderId: user.id,
    },
    include: {
      customer: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
        },
      },
      category: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return (
    <div className="provider-bookings min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your service bookings and appointments</p>
        </div>

        <ProviderBookings bookings={bookings} />
      </div>
    </div>
  );
};

export default ProviderBookingsPage;

