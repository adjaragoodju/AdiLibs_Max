// client/src/components/sections/GoogleBooksPromo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const GoogleBooksPromo = () => {
  return (
    <section className='bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20'>
      <div className='container mx-auto px-6'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-10'>
          <div className='md:w-1/2'>
            <div className='text-sm tracking-widest text-blue-200 uppercase mb-2'>
              POWERED BY GOOGLE
            </div>
            <h2 className='text-4xl font-bold mb-6'>
              Access Millions of Books with Google Books API
            </h2>
            <p className='text-xl text-blue-100 mb-8'>
              Discover new titles, research topics, and expand your reading
              horizons with our Google Books integration.
            </p>
            <Link
              to='/google-books'
              className='inline-block bg-white text-blue-900 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors'
            >
              Explore Google Books
            </Link>
          </div>

          <div className='md:w-1/2 relative'>
            <div className='grid grid-cols-2 gap-4 md:gap-6'>
              {/* Book covers - images would come from your assets */}
              <div className='transform rotate-2 transition-transform hover:rotate-0 hover:scale-105'>
                <img
                  src='/harry-potter-1.jpg'
                  alt='Book Example 1'
                  className='w-full h-64 object-cover rounded-lg shadow-xl'
                  onError={(e) => {
                    e.target.src = '/placeholder-book.jpg';
                  }}
                />
              </div>
              <div className='transform -rotate-2 transition-transform hover:rotate-0 hover:scale-105 mt-8'>
                <img
                  src='/1984.jpg'
                  alt='Book Example 2'
                  className='w-full h-64 object-cover rounded-lg shadow-xl'
                  onError={(e) => {
                    e.target.src = '/placeholder-book.jpg';
                  }}
                />
              </div>
              <div className='transform -rotate-3 transition-transform hover:rotate-0 hover:scale-105'>
                <img
                  src='/pride-prejudice.jpg'
                  alt='Book Example 3'
                  className='w-full h-64 object-cover rounded-lg shadow-xl'
                  onError={(e) => {
                    e.target.src = '/placeholder-book.jpg';
                  }}
                />
              </div>
              <div className='transform rotate-3 transition-transform hover:rotate-0 hover:scale-105 mt-8'>
                <img
                  src='/gatsby.jpg'
                  alt='Book Example 4'
                  className='w-full h-64 object-cover rounded-lg shadow-xl'
                  onError={(e) => {
                    e.target.src = '/placeholder-book.jpg';
                  }}
                />
              </div>
            </div>

            {/* Google logo watermark */}
            <div className='absolute bottom-4 right-4 bg-white bg-opacity-90 py-2 px-4 rounded-lg shadow-lg'>
              <img
                src='/google-books-logo.png'
                alt='Google Books Logo'
                className='h-6'
                onError={(e) => {
                  e.target.src = '/placeholder-logo.png';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleBooksPromo;
