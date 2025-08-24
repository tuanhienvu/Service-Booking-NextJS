'use client';

import React, { useState, useEffect } from 'react';
import ServiceCard from '@/app/components/services/ServiceCard';
import ServiceIcon from '@/app/components/services/ServiceIcon';
import apiService from '@/app/lib/services/apiService';
import EmptyState from '@/app/components/misc/EmptyState';
import Loading from '@/app/components/misc/Loading';
import { category } from '@prisma/client';
import { ServiceCategory } from '@/app/lib/constants/service';
import { LuChevronLeft, LuChevronRight, LuGrid } from 'react-icons/lu';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 12; // Show 12 categories per page

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.categories.get();

      if (response.success) {
        const allCategories = response.data;
        setCategories(allCategories);
        setTotalPages(Math.ceil(allCategories.length / itemsPerPage));
        setError(null);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      setError('An error occurred while fetching categories');
    } finally {
      setLoading(false);
    }
  };

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

  // Get current page categories
  const getCurrentPageCategories = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return categories.slice(startIndex, endIndex);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
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
          <button onClick={fetchCategories} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentCategories = getCurrentPageCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LuGrid className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Service Categories</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of home services. Find the perfect solution for your needs.
          </p>
        </div>

        {/* Categories Grid */}
        {currentCategories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8 max-w-6xl mx-auto">
              {currentCategories.map((item: category) => (
                <ServiceCard
                  key={item.id}
                  title={item.title as string}
                  icon={<ServiceIcon type={getServiceCategoryType(item.title as string)} />}
                  routeUrl={`/services?category=${(item.title as string).toLowerCase()}`}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`btn btn-outline btn-sm ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
                  }`}
                >
                  <LuChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;

                    // Show first 3 pages, last 3 pages, current page, and 2 pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === 2 ||
                      pageNumber === 3 ||
                      pageNumber === totalPages ||
                      pageNumber === totalPages - 1 ||
                      pageNumber === totalPages - 2 ||
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`btn btn-sm min-w-[40px] ${
                            isCurrentPage ? 'btn-primary' : 'btn-outline hover:bg-primary hover:text-white'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }

                    // Show ellipsis for gaps
                    if (
                      (pageNumber === 4 && currentPage > 5) ||
                      (pageNumber === currentPage - 3 && currentPage > 4) ||
                      (pageNumber === currentPage + 3 && currentPage < totalPages - 3) ||
                      (pageNumber === totalPages - 3 && currentPage < totalPages - 4)
                    ) {
                      return (
                        <span key={pageNumber} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`btn btn-outline btn-sm ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
                  }`}
                >
                  Next
                  <LuChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Page Info */}
            <div className="text-center mt-4 text-gray-600">
              <p>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, categories.length)} of {categories.length} categories
              </p>
            </div>
          </>
        ) : (
          <EmptyState description="No categories found." />
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
