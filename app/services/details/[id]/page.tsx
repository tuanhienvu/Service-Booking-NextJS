import React from 'react';
import { redirect } from 'next/navigation';
import { getUser } from '@/app/lib/utils/authUtils';
import prisma from '@/app/lib/utils/prisma/database';
import ServiceDetailsCard from './components/ServiceDetailsCard';
import BookingForm from './components/BookingForm';

export const metadata = {
  title: 'Service Details - Service',
  description: 'Service details description',
  keywords: 'next, next.js, react, app, booking',
};

interface ServiceDetailsPageProps {
  params: { id: string };
}

const ServiceDetailsPage = async ({ params }: ServiceDetailsPageProps) => {
  const serviceId = parseInt(params.id);

  if (isNaN(serviceId)) {
    redirect('/services');
  }

  // Get service details
  const service = await prisma.serviceProvider.findUnique({
    where: { id: serviceId },
    include: {
      category: true,
    },
  });

  if (!service) {
    redirect('/services');
  }

  // Check if user is authenticated
  const user = await getUser();

  return (
    <div className="service-details min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ServiceDetailsCard service={service} />

          {/* Booking section - requires authentication */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book This Service</h2>

            {user ? (
              <BookingForm service={service} user={user} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Please sign in to book this service</p>
                <a
                  href={`/login?redirect=${encodeURIComponent(`/services/details/${serviceId}`)}`}
                  className="btn btn-primary"
                >
                  Sign In to Book
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
