'use client';

import React from 'react';
import Image from 'next/image';
import EmptyState from '@/app/components/misc/EmptyState';
interface ServiceDetailsPersonPhotosProps {
  photos?: any[];
}

const ServiceDetailsPersonPhotos: React.FC<ServiceDetailsPersonPhotosProps> = ({ photos = [] }) => {
  return (
    <div className="flex flex-col px-4 pb-4">
      <h5 className="text-md font-semibold text-base-100 mb-4 sm:text-lg">Service Information</h5>
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-gray-600 text-sm">
          Professional service provider with expertise in their field. Contact for more details about services and availability.
        </p>
      </div>
    </div>
  );
};

export default ServiceDetailsPersonPhotos;
