'use client';

import React from 'react';
import { FaStar, FaMapMarkerAlt, FaClock, FaDollarSign, FaUser, FaTags } from 'react-icons/fa';

interface ServiceDetailsCardProps {
  service: any;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({ service }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.category.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <FaTags className="text-primary" />
                <span>{service.category.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span>4.5 (25 reviews)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">${service.price}</div>
            <div className="text-gray-600">per hour</div>
          </div>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-gray-400 w-5 h-5" />
              <div>
                <div className="font-medium text-gray-900">Location</div>
                <div className="text-gray-600">{service.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaClock className="text-gray-400 w-5 h-5" />
              <div>
                <div className="font-medium text-gray-900">Availability</div>
                <div className="text-gray-600">{service.isAvailable ? 'Available' : 'Not Available'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400 w-5 h-5" />
              <div>
                <div className="font-medium text-gray-900">Service Provider</div>
                <div className="text-gray-600">Professional Service</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaDollarSign className="text-gray-400 w-5 h-5" />
              <div>
                <div className="font-medium text-gray-900">Pricing</div>
                <div className="text-gray-600">${service.price}/hour</div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Service</h3>
          <p className="text-gray-700 leading-relaxed">{service.about}</p>
        </div>

        {/* Reviews Summary */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
              <p className="text-gray-600">{service._count.reviewMessages} reviews</p>
            </div>
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400 w-5 h-5" />
              <span className="text-lg font-semibold">4.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsCard;

