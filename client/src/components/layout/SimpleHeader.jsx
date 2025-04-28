// src/components/layout/SimpleHeader.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useFavorites } from '../../context/FavoritesContext';

const SimpleHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favorites } = useFavorites();
  // const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
            >
              Home
            </Link>
            <Link
              to='/favorites'
              className='font-medium hover:text-black transition-colors flex items-center'
            >
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className='ml-1 bg-black text-white text-xs rounded-full px-2 py-0.5'>
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              to='/profile'
              className='font-medium hover:text-black transition-colors'
            >
              Profile
            </Link>
            <Link
              to='/login'
              className='font-medium hover:text-black transition-colors'
            >
              Login
            </Link>
            <Link
              to='/browse'
              className='font-medium hover:text-black transition-colors'
              aria-label='Search books'
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
            </Link>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden py-4 pb-6 border-t flex flex-col space-y-4'>
            <Link
              to='/'
              className='font-medium hover:text-black transition-colors'
            >
              Home
            </Link>
            <Link
              to='/favorites'
              className='font-medium hover:text-black transition-colors'
            >
              Favorites
              {favorites.length > 0 && (
                <span className='ml-1 bg-black text-white text-xs rounded-full px-2 py-0.5'>
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              to='/profile'
              className='font-medium hover:text-black transition-colors'
            >
              Profile
            </Link>
            <Link
              to='/login'
              className='font-medium hover:text-black transition-colors'
            >
              Login
            </Link>
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

export default SimpleHeader;
