'use client';

import React from 'react';
import { FaUsers, FaUserTie, FaClipboardList, FaTags, FaStar, FaChartLine, FaCog, FaPlus } from 'react-icons/fa';
import Link from 'next/link';

interface AdminDashboardProps {
  user: any;
  stats: {
    totalUsers: number;
    totalServiceProviders: number;
    totalOrders: number;
    totalCategories: number;
    totalReviews: number;
  };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, stats }) => {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'Service Providers',
      value: stats.totalServiceProviders,
      icon: FaUserTie,
      color: 'bg-green-500',
      link: '/admin/service-providers',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FaClipboardList,
      color: 'bg-purple-500',
      link: '/admin/orders',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FaTags,
      color: 'bg-orange-500',
      link: '/admin/categories',
    },
    {
      title: 'Reviews',
      value: stats.totalReviews,
      icon: FaStar,
      color: 'bg-yellow-500',
      link: '/admin/reviews',
    },
  ];

  const quickActions = [
    {
      title: 'Add Category',
      description: 'Create new service category',
      icon: FaPlus,
      link: '/admin/categories/new',
      color: 'bg-green-500',
    },
    {
      title: 'Add Service Provider',
      description: 'Register new service provider',
      icon: FaUserTie,
      link: '/admin/service-providers/new',
      color: 'bg-blue-500',
    },
    {
      title: 'View Orders',
      description: 'Monitor and manage orders',
      icon: FaClipboardList,
      link: '/admin/orders',
      color: 'bg-purple-500',
    },
    {
      title: 'System Settings',
      description: 'Configure application settings',
      icon: FaCog,
      link: '/admin/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.first_name}!</h1>
        <p className="text-gray-600 mt-2">Here&apos;s what&apos;s happening with your Service application</p>
        <div className="mt-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user.role === 'super_admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.link} className="block">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.link} className="block">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
                <div className={`inline-flex p-3 rounded-lg ${action.color} mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">New user registration: {stats.totalUsers} total users</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Service providers: {stats.totalServiceProviders} active providers
            </span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Orders processed: {stats.totalOrders} total orders</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
