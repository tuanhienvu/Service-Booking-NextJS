'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaTags,
  FaStar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import LogoutButton from '@/app/components/auth/LogoutButton';

interface AdminSidebarProps {
  user: any;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: FaTachometerAlt,
      current: pathname === '/admin',
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: FaUsers,
      current: pathname.startsWith('/admin/users'),
    },
    {
      name: 'Service Providers',
      href: '/admin/service-providers',
      icon: FaUserTie,
      current: pathname.startsWith('/admin/service-providers'),
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: FaClipboardList,
      current: pathname.startsWith('/admin/orders'),
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: FaTags,
      current: pathname.startsWith('/admin/categories'),
    },
    {
      name: 'Reviews',
      href: '/admin/reviews',
      icon: FaStar,
      current: pathname.startsWith('/admin/reviews'),
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: FaCog,
      current: pathname.startsWith('/admin/settings'),
    },
  ];

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-bold text-white">Admin Panel</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? <FaBars className="w-5 h-5" /> : <FaTimes className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 pb-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </span>
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-white">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-400 capitalize">{user.role?.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.current ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <LogoutButton isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default AdminSidebar;
