'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { category } from '@prisma/client';
import EmptyState from '@/app/components/misc/EmptyState';
import Loading from '@/app/components/misc/Loading';
import apiService from '@/app/lib/services/apiService';
import {
  LuSearch,
  LuX,
  LuFilter,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from 'react-icons/lu';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SearchFilters {
  category: string;
  service: string;
  provider: string;
  bookingStatus: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    category: '',
    service: '',
    provider: '',
    bookingStatus: '',
  });

  const itemsPerPage = 12; // Show 12 categories per page
  const searchParams = useSearchParams();

  // Booking status options
  const bookingStatusOptions = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'];

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle search query from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlType = searchParams.get('type');

    if (urlSearch) {
      setSearchQuery(decodeURIComponent(urlSearch));
    }

    if (urlType) {
      // Map URL type to search filters
      switch (urlType) {
        case 'category':
          setSearchFilters((prev) => ({ ...prev, category: decodeURIComponent(urlSearch || '') }));
          break;
        case 'service':
          setSearchFilters((prev) => ({ ...prev, service: decodeURIComponent(urlSearch || '') }));
          break;
        case 'provider':
          setSearchFilters((prev) => ({ ...prev, provider: decodeURIComponent(urlSearch || '') }));
          break;
        case 'booking':
          // For booking searches, we might want to show a different message
          // since this would typically search through orders, not categories
          break;
        default:
          // 'all' type - no specific filter needed
          break;
      }
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.categories.get();

      if (response.success) {
        const allCategories = response.data;
        console.log('Categories fetched:', allCategories.length, 'categories');
        setCategories(allCategories);
        setFilteredCategories(allCategories);

        const calculatedTotalPages = Math.ceil(allCategories.length / itemsPerPage);
        console.log(
          'Calculated total pages:',
          calculatedTotalPages,
          'for',
          allCategories.length,
          'items with',
          itemsPerPage,
          'per page',
        );

        setTotalPages(calculatedTotalPages);
        setError(null);
      } else {
        setError('Failed to fetch categories');
        console.error('API response error:', response);
      }
    } catch (err) {
      setError('An error occurred while fetching categories');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply search and filters
  const applySearchAndFilters = useCallback(() => {
    let filtered = [...categories];

    // Normal search through all fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cat) =>
          cat.title?.toLowerCase().includes(query) ||
          // Add more searchable fields here if available
          cat.id.toString().includes(query),
      );
    }

    // Advanced filters
    if (searchFilters.category) {
      filtered = filtered.filter((cat) => cat.title?.toLowerCase().includes(searchFilters.category.toLowerCase()));
    }

    if (searchFilters.service) {
      filtered = filtered.filter((cat) => cat.title?.toLowerCase().includes(searchFilters.service.toLowerCase()));
    }

    // Note: Provider and booking status filters would need additional data
    // This is a placeholder for when those features are implemented

    setFilteredCategories(filtered);

    // Reset pagination when search changes
    setCurrentPage(1);

    // Recalculate total pages for filtered results
    const newTotalPages = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(newTotalPages);
  }, [searchQuery, searchFilters, categories, itemsPerPage]);

  // Apply search and filters whenever they change
  useEffect(() => {
    applySearchAndFilters();
  }, [searchQuery, searchFilters, categories, applySearchAndFilters]);

  // Clear all search and filters
  const clearSearchAndFilters = () => {
    setSearchQuery('');
    setSearchFilters({
      category: '',
      service: '',
      provider: '',
      bookingStatus: '',
    });
    setShowAdvancedSearch(false);
  };

  // Get current page categories
  const getCurrentPageCategories = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const result = filteredCategories.slice(startIndex, endIndex);
    console.log('Current page categories:', {
      startIndex,
      endIndex,
      resultLength: result.length,
      currentPage,
      totalPages,
    });
    return result;
  };

  // Ensure we have valid pagination state
  useEffect(() => {
    if (filteredCategories.length > 0 && totalPages === 0) {
      const calculatedPages = Math.ceil(filteredCategories.length / itemsPerPage);
      console.log('Fixing total pages from 0 to:', calculatedPages);
      setTotalPages(calculatedPages);
    }
  }, [filteredCategories.length, totalPages, itemsPerPage]);

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

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(totalPages);
  };

  // Generate page numbers with smart ellipsis
  const generatePageNumbers = useCallback(() => {
    const pages = [];

    // Always show all pages if total is 10 or less
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // For larger page counts, show smart pagination
    if (currentPage <= 5) {
      // Show first 7 pages + ellipsis + last page
      for (let i = 1; i <= 7; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 4) {
      // Show first page + ellipsis + last 7 pages
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 6; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page + ellipsis + current page ± 2 + ellipsis + last page
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, currentPage]);

  // Debug function to check pagination state
  const debugPagination = useCallback(() => {
    console.log('Debug Pagination:', {
      totalPages,
      currentPage,
      categoriesLength: categories.length,
      filteredLength: filteredCategories.length,
      itemsPerPage,
    });
  }, [totalPages, currentPage, categories.length, filteredCategories.length, itemsPerPage]);

  useEffect(() => {
    if (totalPages > 1) {
      debugPagination();
    }
  }, [totalPages, currentPage, categories.length, filteredCategories.length, debugPagination]);

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
  const pageNumbers = generatePageNumbers();

  return (
    <div className="services flex flex-col flex-grow w-full">
      <div className="container mx-auto py-4 px-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold mb-4">Service Categories</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of home services. Find the perfect solution for your needs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Normal Search */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search through categories, services, providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <LuX className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className={`btn btn-outline flex items-center gap-2 ${showAdvancedSearch ? 'btn-primary' : ''}`}
              >
                <LuFilter className="w-4 h-4" />
                Advanced
                <LuChevronDown className={`w-4 h-4 transition-transform ${showAdvancedSearch ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Advanced Search Options */}
            {showAdvancedSearch && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      placeholder="Filter by category"
                      value={searchFilters.category}
                      onChange={(e) => setSearchFilters((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Service Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                    <input
                      type="text"
                      placeholder="Filter by service"
                      value={searchFilters.service}
                      onChange={(e) => setSearchFilters((prev) => ({ ...prev, service: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Provider Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                    <input
                      type="text"
                      placeholder="Filter by provider"
                      value={searchFilters.provider}
                      onChange={(e) => setSearchFilters((prev) => ({ ...prev, provider: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Booking Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                    <select
                      value={searchFilters.bookingStatus}
                      onChange={(e) => setSearchFilters((prev) => ({ ...prev, bookingStatus: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      {bookingStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={clearSearchAndFilters}
                    className="btn btn-outline btn-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Search Results Summary */}
            {(searchQuery || Object.values(searchFilters).some((filter) => filter)) && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Showing {filteredCategories.length} of {categories.length} categories
                    {searchQuery && (
                      <span className="ml-2">
                        for &ldquo;<span className="font-medium">{searchQuery}</span>&rdquo;
                      </span>
                    )}
                  </span>
                  {filteredCategories.length !== categories.length && (
                    <button onClick={clearSearchAndFilters} className="text-primary hover:text-primary-dark underline">
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Buttons - Service Page Style */}
        <div className="home-popular-services-filter flex flex-wrap gap-2 mb-6 justify-center">
          <button
            type="button"
            className="btn btn-primary btn-outline btn-sm rounded-badge"
            onClick={() => {
              setSearchQuery('');
              setSearchFilters({
                category: '',
                service: '',
                provider: '',
                bookingStatus: '',
              });
            }}
          >
            All Categories
          </button>
          {categories.slice(0, 10).map((category: category) => (
            <button
              type="button"
              key={category.id}
              className="btn btn-primary btn-outline btn-sm rounded-badge"
              onClick={() => {
                setSearchQuery(category.title as string);
                setSearchFilters((prev) => ({ ...prev, category: category.title as string }));
              }}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Categories Grid - Service Page Style */}
        {currentCategories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentCategories.map((item: category) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">Category</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2 text-gray-400">📂</span>
                        <span>Service Category</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2 text-gray-400">🛠️</span>
                        <span>Available Services</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2 text-gray-400">👥</span>
                        <span>Service Providers</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4">
                      Explore {item.title} services and find qualified professionals in your area.
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Service Category</span>
                      <div className="flex gap-2">
                        <Link
                          href={`/services?category=${(item.title as string).toLowerCase()}`}
                          className="btn btn-outline btn-sm"
                        >
                          View Services
                        </Link>
                        <Link
                          href={`/login?redirect=${encodeURIComponent(`/services?category=${(item.title as string).toLowerCase()}`)}`}
                          className="btn btn-primary btn-sm"
                        >
                          Browse Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4">
                {/* Page Info */}
                <div className="text-center text-gray-600">
                  <p className="text-sm">
                    Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-semibold">
                      {Math.min(currentPage * itemsPerPage, filteredCategories.length)}
                    </span>{' '}
                    of <span className="font-semibold">{filteredCategories.length}</span> categories
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Page <span className="font-semibold">{currentPage}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                  </p>
                  {/* Debug info - remove in production */}
                  <p className="text-xs text-blue-500 mt-1">Debug: {pageNumbers.length} page numbers generated</p>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {/* First Page Button */}
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`btn btn-outline btn-sm ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed bg-gray-100'
                        : 'hover:bg-primary hover:text-white hover:border-primary'
                    }`}
                    title="Go to first page"
                  >
                    <LuChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Previous Button */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`btn btn-outline btn-sm ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed bg-gray-100'
                        : 'hover:bg-primary hover:text-white hover:border-primary'
                    }`}
                    title="Go to previous page"
                  >
                    <LuChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {pageNumbers.length > 0
                      ? pageNumbers.map((page, index) => {
                          if (page === '...') {
                            return (
                              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500 font-medium">
                                ...
                              </span>
                            );
                          }

                          const pageNumber = page as number;
                          const isCurrentPage = pageNumber === currentPage;

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              className={`btn btn-sm min-w-[44px] h-[44px] text-sm font-medium transition-all duration-200 ${
                                isCurrentPage
                                  ? 'btn-primary shadow-lg scale-105'
                                  : 'btn-outline hover:bg-primary hover:text-white hover:border-primary hover:scale-105'
                              }`}
                              title={`Go to page ${pageNumber}`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })
                      : // Fallback: Show simple page numbers if the smart logic fails
                        Array.from({ length: totalPages }, (_, index) => {
                          const pageNumber = index + 1;
                          const isCurrentPage = pageNumber === currentPage;

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              className={`btn btn-sm min-w-[44px] h-[44px] text-sm font-medium transition-all duration-200 ${
                                isCurrentPage
                                  ? 'btn-primary shadow-lg scale-105'
                                  : 'btn-outline hover:bg-primary hover:text-white hover:border-primary hover:scale-105'
                              }`}
                              title={`Go to page ${pageNumber}`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`btn btn-outline btn-sm ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed bg-gray-100'
                        : 'hover:bg-primary hover:text-white hover:border-primary'
                    }`}
                    title="Go to next page"
                  >
                    Next
                    <LuChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page Button */}
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className={`btn btn-outline btn-sm ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed bg-gray-100'
                        : 'hover:bg-primary hover:text-white hover:border-primary'
                    }`}
                    title="Go to last page"
                  >
                    <LuChevronsRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Jump to Page */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Go to page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        goToPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span>of {totalPages}</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState description="No categories found matching your search criteria." />
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
