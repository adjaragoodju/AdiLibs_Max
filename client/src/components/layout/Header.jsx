// src/components/layout/Header.jsx
import React from 'react';
import Logo from '../ui/Logo';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = ({
  mobileMenuOpen,
  toggleMobileMenu,
  hoveredNavItem,
  setHoveredNavItem,
}) => {
  const { favorites } = useFavorites();
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className='fixed top-0 left-0 right-0 bg-white shadow-md z-50'>
      <div className='container mx-auto px-4'>
        <nav className='flex justify-between items-center py-4'>
          <div className='flex items-center'>
            <Link to='/'>
              <Logo />
            </Link>
          </div>
          {/* Mobile menu button */}
          <button
            className='md:hidden'
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            )}
          </button>
          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link
              to='/'
              className='font-medium hover:text-black transition-colors'
              onMouseEnter={() => setHoveredNavItem('home')}
              onMouseLeave={() => setHoveredNavItem(null)}
            >
              <span
                className={`relative ${
                  hoveredNavItem === 'home'
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                    : ''
                }`}
              >
                Home
              </span>
            </Link>

            <Link
              to='/favorites'
              className='font-medium hover:text-black transition-colors flex items-center'
              onMouseEnter={() => setHoveredNavItem('favorites')}
              onMouseLeave={() => setHoveredNavItem(null)}
            >
              <span
                className={`relative ${
                  hoveredNavItem === 'favorites'
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                    : ''
                }`}
              >
                Favorites
              </span>
              {favorites.length > 0 && (
                <span className='ml-1 bg-black text-white text-xs rounded-full px-2 py-0.5'>
                  {favorites.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              // Show these items when user is logged in
              <>
                <Link
                  to='/profile'
                  className='font-medium hover:text-black transition-colors'
                  onMouseEnter={() => setHoveredNavItem('profile')}
                  onMouseLeave={() => setHoveredNavItem(null)}
                >
                  <span
                    className={`relative ${
                      hoveredNavItem === 'profile'
                        ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                        : ''
                    }`}
                  >
                    Profile
                  </span>
                </Link>

                <button
                  onClick={() => logout()}
                  className='font-medium hover:text-black transition-colors'
                  onMouseEnter={() => setHoveredNavItem('logout')}
                  onMouseLeave={() => setHoveredNavItem(null)}
                >
                  <span
                    className={`relative ${
                      hoveredNavItem === 'logout'
                        ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                        : ''
                    }`}
                  >
                    Logout
                  </span>
                </button>
              </>
            ) : (
              // Show login when user is not logged in
              <Link
                to='/login'
                className='font-medium hover:text-black transition-colors'
                onMouseEnter={() => setHoveredNavItem('login')}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                <span
                  className={`relative ${
                    hoveredNavItem === 'login'
                      ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                      : ''
                  }`}
                >
                  Login
                </span>
              </Link>
            )}

            <Link
              to='/google-books'
              className='font-medium hover:text-black transition-colors'
              onMouseEnter={() => setHoveredNavItem('googlebooks')}
              onMouseLeave={() => setHoveredNavItem(null)}
            >
              <span
                className={`relative ${
                  hoveredNavItem === 'googlebooks'
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                    : ''
                }`}
              >
                Google Books
              </span>
            </Link>

            <Link
              to='/browse'
              className='font-medium hover:text-black transition-colors'
              onMouseEnter={() => setHoveredNavItem('search')}
              onMouseLeave={() => setHoveredNavItem(null)}
              aria-label='Search'
            >
              <span
                className={`relative ${
                  hoveredNavItem === 'search'
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                    : ''
                }`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </span>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden py-4 pb-6 border-t flex flex-col space-y-4'>
            <Link
              to='/'
              className='font-medium hover:text-black transition-colors block'
            >
              Home
            </Link>
            <Link
              to='/favorites'
              className='font-medium hover:text-black transition-colors block'
            >
              Favorites
              {favorites.length > 0 && (
                <span className='ml-1 bg-black text-white text-xs rounded-full px-2 py-0.5'>
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              to='/google-books'
              className='font-medium hover:text-black transition-colors block'
            >
              Google Books
            </Link>

            {isAuthenticated ? (
              // Show these items when user is logged in - mobile version
              <>
                <Link
                  to='/profile'
                  className='font-medium hover:text-black transition-colors block'
                >
                  Profile
                </Link>
                <button
                  onClick={() => logout()}
                  className='font-medium hover:text-black transition-colors block text-left'
                >
                  Logout
                </button>
              </>
            ) : (
              // Show login when user is not logged in - mobile version
              <Link
                to='/login'
                className='font-medium hover:text-black transition-colors block'
              >
                Login
              </Link>
            )}

            <Link
              to='/browse'
              className='font-medium hover:text-black transition-colors flex items-center'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
              Search
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
