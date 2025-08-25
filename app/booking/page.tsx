'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuSearch, LuFilter, LuCalendar, LuMapPin, LuClock, LuDollarSign } from 'react-icons/lu';
import Loading from '@/app/components/misc/Loading';
import EmptyState from '@/app/components/misc/EmptyState';
import apiService from '@/app/lib/services/apiService';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: {
    id: string;
    title: string;
  };
  provider: {
    id: string;
    name: string;
    rating: number;
  };
}

const BookingPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiService.services.get();

      if (response.success) {
        setServices(response.data);
        setFilteredServices(response.data);
      } else {
        setError('Failed to fetch services');
      }
    } catch (err) {
      setError('An error occurred while fetching services');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.categories.get();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...services];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.category.title.toLowerCase().includes(query) ||
          service.provider.name.toLowerCase().includes(query),
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((service) => service.category.id === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, services]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, services, applyFilters]);

  const handleServiceSelect = (service: Service) => {
    router.push(`/services/details/${service.id}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" className="text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchServices} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Your Service</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our available services and book the perfect solution for your needs. Choose from a wide range
            of professional service providers.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <EmptyState
              description="No services found. Try adjusting your search criteria or browse all available services."
              size="large"
            />
            <div className="mt-6">
              <button onClick={clearFilters} className="btn btn-primary">
                View All Services
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleServiceSelect(service)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                      {service.category.title}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ${service.price}
                      <span className="text-sm text-gray-500">/hr</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <LuMapPin className="w-4 h-4" />
                      <span>{service.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuClock className="w-4 h-4" />
                      <span>Available now</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {service.provider.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{service.provider.name}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600">{service.provider.rating}</span>
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-primary btn-sm">Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Can&apos;t find what you&apos;re looking for? Our team is here to help you find the perfect service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories" className="btn btn-outline">
                Browse All Categories
              </Link>
              <Link href="/about" className="btn btn-primary">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
