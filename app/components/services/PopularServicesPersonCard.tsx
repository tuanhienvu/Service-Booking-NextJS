'use client';

import React from 'react';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt, FaClock, FaDollarSign } from 'react-icons/fa';
import { serviceProviderExtended } from '@/app/lib/interfaces/service';

interface PopularServicesPersonCardProps {
  item: serviceProviderExtended;
}

const PopularServicesPersonCard: React.FC<PopularServicesPersonCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{item.category.title}</h3>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 w-4 h-4 mr-1" />
            <span className="text-sm text-gray-600">{item.rating ? item.rating.toFixed(1) : '0.0'}</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
            <span>{item.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="w-4 h-4 mr-2 text-gray-400" />
            <span>Available</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaDollarSign className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-semibold text-green-600">${item.price ? item.price.toFixed(2) : '0.00'}/hr</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{item.about || 'No description available'}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{item._count?.reviewMessages || 0} reviews</span>
          <div className="flex gap-2">
            <Link href={`/services/details/${item.id}`} className="btn btn-outline btn-sm">
              View Details
            </Link>
            <Link
              href={`/login?redirect=${encodeURIComponent(`/services/details/${item.id}`)}`}
              className="btn btn-primary btn-sm"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularServicesPersonCard;
