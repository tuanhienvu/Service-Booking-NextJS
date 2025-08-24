'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaEdit, FaDollarSign } from 'react-icons/fa';

interface BookingFormProps {
  service: any;
  user: any;
}

const BookingForm: React.FC<BookingFormProps> = ({ service, user }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    notes: '',
    duration: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create booking
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceProviderId: service.id,
          categoryId: service.categoryId,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          notes: formData.notes,
          duration: formData.duration,
          amount: service.price * formData.duration,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to success page
        router.push(`/order/success?id=${result.data.id}`);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while creating the booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Service Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FaEdit className="text-primary" />
            <span className="text-gray-600">{service.category.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-primary" />
            <span className="text-gray-600">${service.price}/hour</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary" />
            <span className="text-gray-600">{service.location}</span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaCalendar className="inline mr-2" />
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaClock className="inline mr-2" />
            Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FaMapMarkerAlt className="inline mr-2" />
          Service Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
          placeholder="Enter your address or preferred location"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
        <select
          name="duration"
          value={formData.duration}
          onChange={handleInputChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value={1}>1 hour</option>
          <option value={2}>2 hours</option>
          <option value={3}>3 hours</option>
          <option value={4}>4 hours</option>
          <option value={5}>5 hours</option>
          <option value={6}>6 hours</option>
          <option value={7}>7 hours</option>
          <option value={8}>8 hours</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          placeholder="Any special requirements or instructions..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Total Cost */}
      <div className="bg-primary/10 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Cost:</span>
          <span className="text-2xl font-bold text-primary">${(service.price * formData.duration).toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {formData.duration} hour(s) × ${service.price}/hour
        </p>
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary btn-lg">
        {isSubmitting ? 'Creating Booking...' : 'Book This Service'}
      </button>
    </form>
  );
};

export default BookingForm;
