import React, { Suspense } from 'react';
import ServicesCategories from '../services/ServicesCategories';
import Loading from '@/app/components/misc/Loading';

interface ServiceCategories {
  title: string;
}

const ServiceCategories: React.FC<ServiceCategories> = async ({ title = 'Services' }) => {
  return (
    <div className="service-categories py-4 px-4 sm:py-8">
      <h2 className="text-center font-semibold mb-8 text-xl">{title}</h2>
      <Suspense fallback={<Loading size="large" className="my-0 mx-auto flex justify-center text-primary" />}>
        <ServicesCategories />
      </Suspense>
    </div>
  );
};

export default ServiceCategories;
