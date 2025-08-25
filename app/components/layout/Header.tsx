'use client';

import React, { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuUserCircle2, LuSearch, LuX } from 'react-icons/lu';
import { useCallback } from 'react';
import Loading from '@/app/components/misc/Loading';
import LogoutButton from '@/app/components/auth/LogoutButton';
import { MdMenu } from 'react-icons/md';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user: Record<string, any> | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchType, setSearchType] = useState('all'); // all, category, service, booking, provider
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);

  const router = useRouter();

  // Search type options
  const searchTypeOptions = [
    { value: 'all', label: 'All', icon: '🔍' },
    { value: 'category', label: 'Category', icon: '📂' },
    { value: 'service', label: 'Service', icon: '🛠️' },
    { value: 'booking', label: 'Booking', icon: '📅' },
    { value: 'provider', label: 'Provider', icon: '👤' },
  ];

  const onBlurMobileDropdown = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (isMobileMenuOpen) {
        if (e.relatedTarget && e.relatedTarget.classList.contains('menu-link')) {
          setTimeout(() => {
            setIsMobileMenuOpen(false);
          }, 250);

          return;
        }
        setIsMobileMenuOpen(false);
      }
    },
    [isMobileMenuOpen],
  );

  const onBlurUserMenuDropdown = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (isUserMenuOpen) {
        if (e.relatedTarget && e.relatedTarget.classList.contains('user-menu-link')) {
          setTimeout(() => {
            setIsUserMenuOpen(false);
          }, 250);

          return;
        }
        setIsUserMenuOpen(false);
      }
    },
    [isUserMenuOpen],
  );

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (searchQuery.trim()) {
        // Navigate to categories page with search query and type
        const searchParams = new URLSearchParams();
        searchParams.set('search', searchQuery.trim());
        if (searchType !== 'all') {
          searchParams.set('type', searchType);
        }
        router.push(`/categories?${searchParams.toString()}`);
        setSearchQuery('');
        setIsSearchExpanded(false);
        setShowSearchOptions(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback: just navigate to categories page
      router.push('/categories');
    }
  };

  // Clear search and collapse
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchExpanded(false);
    setShowSearchOptions(false);
  };

  // Debug search state changes
  useEffect(() => {
    console.log('Search state changed:', {
      isSearchExpanded,
      isSearchFocused,
      searchQuery: searchQuery.trim(),
      searchType,
      isSearchHovered,
    });
  }, [isSearchExpanded, isSearchFocused, searchQuery, searchType, isSearchHovered]);

  // Handle search input focus
  const handleSearchFocus = () => {
    console.log('Search focused - expanding');
    setIsSearchFocused(true);
    setIsSearchExpanded(true);
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    console.log('Search blurred');
    setIsSearchFocused(false);
    // Always collapse when losing focus
    setTimeout(() => {
      console.log('Collapsing search after blur');
      setIsSearchExpanded(false);
      setShowSearchOptions(false);
    }, 100);
  };

  return (
    <div className="header min-h-[65px]">
      <div className="navbar bg-slate-800 px-4 py-1 fixed z-[9999] rounded-none shadow-lg border-b border-slate-700">
        <div className="navbar-start">
          <div className="dropdown" onBlur={onBlurMobileDropdown}>
            <label
              tabIndex={0}
              className="btn btn-circle bg-slate-700 border-slate-600 btn-sm swap swap-rotate lg:hidden hover:bg-slate-600 text-white"
            >
              <input type="checkbox" onChange={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
              {isMobileMenuOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
            </label>
            {isMobileMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg bg-slate-800 rounded-box w-52 border border-slate-700"
              >
                <li>
                  <Link className="menu-link text-white hover:text-primary focus:text-primary" href="/about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="menu-link text-white hover:text-primary focus:text-primary" href="/services">
                    Services
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <Link className="btn btn-ghost text-xl hidden lg:flex hover:bg-slate-700" href="/">
            <Image className="dark:invert" src="/images/logo.svg" alt="Logo" width={35} height={35} priority />
          </Link>
        </div>

        <div className="navbar-center">
          <Link className="btn btn-ghost text-xl lg:hidden hover:bg-slate-700" href="/">
            <Image className="dark:invert" src="/images/logo.svg" alt="Logo" width={35} height={35} priority />
          </Link>

          {/* Desktop Navigation */}
          <ul className="menu menu-horizontal px-1 text-white hidden lg:flex">
            <li>
              <Link className="text-white hover:text-primary focus:text-primary" href="/about">
                About Us
              </Link>
            </li>
            <li>
              <Link className="text-white hover:text-primary focus:text-primary" href="/services">
                Services
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          {/* Search Bar - Desktop */}
          <div className="hidden lg:block mr-4">
            <div
              className={`relative transition-all duration-300 ease-in-out ${isSearchExpanded ? 'w-96' : 'w-12'}`}
              onMouseEnter={() => {
                console.log('Mouse entered search area');
                setIsSearchExpanded(true);
              }}
              onMouseLeave={() => {
                console.log('Mouse left search area');
                // Always collapse when mouse leaves
                setIsSearchExpanded(false);
                setIsSearchFocused(false);
              }}
            >
              <form onSubmit={handleSearch} className="relative">
                <div
                  className={`relative flex items-center rounded-full transition-all duration-300 ${
                    isSearchExpanded ? 'p-1' : 'p-0'
                  }`}
                  style={{
                    borderWidth: isSearchExpanded || isSearchHovered ? '1px' : '0px',
                    borderColor: isSearchExpanded || isSearchHovered ? 'rgb(71 85 105)' : 'transparent',
                    backgroundColor: isSearchExpanded || isSearchHovered ? 'rgb(51 65 85)' : 'transparent',
                  }}
                  onMouseEnter={() => setIsSearchHovered(true)}
                  onMouseLeave={() => setIsSearchHovered(false)}
                >
                  {/* Search Type Selector */}
                  {isSearchExpanded && (
                    <div className="relative mr-2">
                      <button
                        type="button"
                        onClick={() => setShowSearchOptions(!showSearchOptions)}
                        className={`flex items-center gap-2 text-white px-3 py-2 rounded-full text-sm transition-colors min-w-[100px] ${
                          isSearchHovered ? 'bg-slate-600' : 'bg-slate-700'
                        } hover:bg-slate-500`}
                      >
                        <span>{searchTypeOptions.find((opt) => opt.value === searchType)?.icon}</span>
                        <span>{searchTypeOptions.find((opt) => opt.value === searchType)?.label}</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Search Type Dropdown */}
                      {showSearchOptions && (
                        <div className="absolute top-full left-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-50 min-w-[120px]">
                          {searchTypeOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setSearchType(option.value);
                                setShowSearchOptions(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-600 transition-colors flex items-center gap-2 ${
                                searchType === option.value ? 'bg-slate-600 text-primary' : 'text-white'
                              }`}
                            >
                              <span>{option.icon}</span>
                              <span>{option.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder={`Search ${searchType === 'all' ? 'everything' : searchType}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    className={`bg-transparent text-white placeholder-gray-300 border-none outline-none transition-all duration-300 ${
                      isSearchExpanded ? 'w-full pl-4 pr-10 py-2' : 'w-0 pl-0 pr-0 py-2'
                    }`}
                    style={{
                      minWidth: isSearchExpanded ? 'auto' : '0px',
                      overflow: 'hidden',
                    }}
                  />

                  {/* Search Icon - Always visible */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none">
                    <LuSearch className="w-5 h-5" />
                  </div>

                  {/* Clear Button */}
                  {searchQuery && isSearchExpanded && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                    >
                      <LuX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Mobile Search Button */}
          <div className="lg:hidden mr-2">
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="btn btn-circle btn-sm bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
            >
              <LuSearch className="w-5 h-5" />
            </button>
          </div>

          {user && !isPending && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="relative btn btn-outline btn-circle text-white bg-white border-white m-1 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-200"
                onBlur={onBlurUserMenuDropdown}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {user && (
                  <div className="avatar flex items-center justify-center absolute top-0 left-0 w-full h-full rounded-full overflow-hidden">
                    {user.imageUrl && <Image width={100} height={100} src={user?.imageUrl} alt="User avatar" />}
                    {!user.imageUrl && <LuUserCircle2 className="w-6 h-6 text-slate-800" />}
                  </div>
                )}
                {!user && <LuUserCircle2 />}
              </div>
              {isUserMenuOpen && (
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-box w-52 border border-slate-200"
                >
                  <li className="block w-full">
                    <p className="user-menu-link block text-slate-800 font-semibold text-ellipsis overflow-hidden">
                      {user?.email}
                    </p>
                  </li>
                  <li>
                    <Link className="user-menu-link text-slate-700 hover:text-primary" href="/user/profile">
                      User Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="user-menu-link text-slate-700 hover:text-primary" href="/update-password">
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <LogoutButton
                      className="user-menu-link text-slate-700 hover:text-primary w-full text-left"
                      showIcon={false}
                      showText={true}
                    />
                  </li>
                </ul>
              )}
            </div>
          )}
          {!user && !isPending && (
            <Link className="btn btn-primary btn-sm font-normal" href="/login">
              Sign In
            </Link>
          )}
          {isPending && <Loading size="small" className="text-primary" classNameContainer="flex" />}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchExpanded && (
        <div className="lg:hidden fixed top-[65px] left-0 right-0 z-[9998] bg-slate-800 border-b border-slate-700 p-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
              <div className="flex flex-col gap-3">
                {/* Search Type Selector - Mobile */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSearchOptions(!showSearchOptions)}
                    className="flex items-center justify-between w-full bg-slate-600 text-white px-4 py-3 rounded-lg text-sm hover:bg-slate-500 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{searchTypeOptions.find((opt) => opt.value === searchType)?.icon}</span>
                      <span>Search by: {searchTypeOptions.find((opt) => opt.value === searchType)?.label}</span>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Search Type Dropdown - Mobile */}
                  {showSearchOptions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-50">
                      {searchTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSearchType(option.value);
                            setShowSearchOptions(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-600 transition-colors flex items-center gap-3 ${
                            searchType === option.value ? 'bg-slate-600 text-primary' : 'text-white'
                          }`}
                        >
                          <span className="text-lg">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Input - Mobile */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${searchType === 'all' ? 'everything' : searchType}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-600 text-white placeholder-gray-300 border border-slate-500 rounded-lg pl-12 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />

                  {/* Search Icon */}
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300">
                    <LuSearch className="w-5 h-5" />
                  </div>

                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                    >
                      <LuX className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Header;
