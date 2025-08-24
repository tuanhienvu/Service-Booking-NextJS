'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';

interface LogoutButtonProps {
  isCollapsed?: boolean;
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  isCollapsed = false,
  className = '',
  showIcon = true,
  showText = true,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // Clear any session flags
      sessionStorage.clear();

      // Call the logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to login page
        router.push('/login');

        // Force a page reload to ensure clean state
        window.location.reload();
      } else {
        // Fallback: clear cookie manually and redirect
        document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push('/login');
        window.location.reload();
      }
    } catch (error) {
      // Fallback: clear cookie manually and redirect
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      router.push('/login');
      window.location.reload();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const defaultClassName = isCollapsed
    ? 'flex items-center justify-center px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors'
    : 'flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors';

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className || defaultClassName}
      title={isCollapsed ? 'Logout' : ''}
    >
      {showIcon && (
        <>
          {isLoggingOut ? (
            <FaSpinner className="w-5 h-5 flex-shrink-0 animate-spin" />
          ) : (
            <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
          )}
        </>
      )}
      {showText && !isCollapsed && <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
    </button>
  );
};

export default LogoutButton;
