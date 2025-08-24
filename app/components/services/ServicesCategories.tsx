import React from 'react';
import ServiceCard from './ServiceCard';
import ServiceIcon from './ServiceIcon';
import apiService from '@/app/lib/services/apiService';
import EmptyState from '@/app/components/misc/EmptyState';
import { category } from '@prisma/client';
import { ServiceCategory } from '@/app/lib/constants/service';

const ServicesCategories = async () => {
  let categories = [];
  const response = await apiService.categories.get();

  if (response.success) {
    categories = response.data;
  } else {
    // Failed to fetch categories
  }

  // Function to map category title to ServiceCategory enum
  const getServiceCategoryType = (title: string): ServiceCategory => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('cleaning')) return ServiceCategory.cleaning;
    if (lowerTitle.includes('repair') || lowerTitle.includes('repairs')) return ServiceCategory.repairing;
    if (lowerTitle.includes('paint')) return ServiceCategory.painting;
    if (lowerTitle.includes('plumb')) return ServiceCategory.plumbing;
    if (lowerTitle.includes('appliance') || lowerTitle.includes('electrical')) return ServiceCategory.appliance;
    if (lowerTitle.includes('moving') || lowerTitle.includes('delivery')) return ServiceCategory.shifting;

    // Default fallback
    return ServiceCategory.cleaning;
  };

  return (
    <div className="services-categories flex flex-col">
      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((item: category) => (
            <ServiceCard
              key={item.id}
              title={item.title as string}
              icon={<ServiceIcon type={getServiceCategoryType(item.title as string)} />}
              routeUrl={`/services?category=${(item.title as string).toLowerCase()}`}
            />
          ))}
        </div>
      )}
      {categories.length === 0 && <EmptyState description="No categories found." />}
    </div>
  );
};

export default ServicesCategories;
