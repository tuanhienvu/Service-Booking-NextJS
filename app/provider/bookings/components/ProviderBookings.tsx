'use client';

import React, { useState } from 'react';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { format } from 'date-fns';

interface ProviderBookingsProps {
  bookings: any[];
}

const ProviderBookings: React.FC<ProviderBookingsProps> = ({ bookings }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredBookings = selectedStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
        <p className="text-gray-600">You haven&apos;t received any service requests yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="text-sm font-medium text-gray-700">Filter by status:</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Bookings</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <span className="text-sm text-gray-600">
          {filteredBookings.length} of {bookings.length} bookings
        </span>
      </div>

      {/* Bookings List */}
      <div className="grid gap-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Booking Details */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.category?.title || 'Service'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Booking #{booking.id}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FaUser className="text-primary" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {booking.customer?.first_name} {booking.customer?.last_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <span className="text-gray-600">{booking.customer?.email}</span>
                    </div>
                    {booking.customer?.phone && (
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        <span className="text-gray-600">{booking.customer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-primary" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-primary" />
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{formatTime(booking.time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{booking.location}</span>
                  </div>
                </div>

                {booking.notes && (
                  <div>
                    <span className="text-sm text-gray-600">Notes: </span>
                    <span className="text-sm font-medium">{booking.notes}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Booked on {formatDate(booking.created_at)}
                  </div>
                  <div className="text-lg font-bold text-primary">
                    ${booking.amount?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 lg:flex-shrink-0">
                {booking.status === 'Pending' && (
                  <>
                    <button className="btn btn-primary btn-sm">
                      Accept Booking
                    </button>
                    <button className="btn btn-outline btn-sm">
                      Decline
                    </button>
                  </>
                )}
                {booking.status === 'Confirmed' && (
                  <button className="btn btn-primary btn-sm">
                    Start Service
                  </button>
                )}
                {booking.status === 'In Progress' && (
                  <button className="btn btn-success btn-sm">
                    Mark Complete
                  </button>
                )}
                {booking.status === 'Completed' && (
                  <span className="text-green-600 text-sm font-medium">
                    ✓ Service Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderBookings;
