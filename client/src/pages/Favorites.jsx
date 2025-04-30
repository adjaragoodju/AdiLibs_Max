// src/pages/Favorites.jsx
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import SimpleLayout from '../components/layout/SimpleLayout';

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites, loading } = useFavorites();
  const { isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <SimpleLayout>
        <div className='container mx-auto px-6 py-8 text-center'>
          <div className='w-16 h-16 mx-auto mb-4 border-t-4 border-b-4 border-black rounded-full animate-spin'></div>
          <p className='text-xl font-medium'>Loading your favorites...</p>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <div className='container mx-auto px-6 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Your Favorites</h1>

        {isAuthenticated ? (
          <div className='mb-6 bg-blue-50 border-l-4 border-blue-500 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-blue-500'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0010-5.944A5 5 0 0010 7z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm text-blue-700'>
                  Logged in as{' '}
                  <span className='font-semibold'>{user.username}</span>. Your
                  favorites are synced with your account.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-yellow-400'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm text-yellow-700'>
                  You are not signed in. Your favorites are stored locally and
                  will be lost if you clear your browser data.{' '}
                  <Link
                    to='/login'
                    className='font-medium underline text-yellow-700 hover:text-yellow-600'
                  >
                    Sign in
                  </Link>{' '}
                  to save your favorites to your account.
                </p>
              </div>
            </div>
          </div>
        )}

        {favorites.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-1'>
            {favorites.map((book, index) => (
              <div
                key={index}
                className='flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors'
              >
                <div
                  className='cursor-pointer'
                  onClick={() =>
                    navigate(`/book/${encodeURIComponent(book.title)}`)
                  }
                >
                  <img
                    src={book.image || '/placeholder-book.jpg'}
                    alt={book.title}
                    className='w-16 h-24 object-cover rounded hover:opacity-90 transition-opacity'
                  />
                </div>

                <div
                  className='flex-grow px-4 cursor-pointer'
                  onClick={() =>
                    navigate(`/book/${encodeURIComponent(book.title)}`)
                  }
                >
                  <h3 className='font-medium text-lg hover:text-blue-600 transition-colors'>
                    {book.title}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {book.author} - {book.year}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>{book.genre}</p>
                </div>

                <button
                  className='text-red-500 hover:text-red-700 p-2 flex items-center transition-colors'
                  onClick={() => removeFromFavorites(book)}
                  aria-label='Remove from favorites'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-16 bg-gray-50 rounded-lg'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-16 w-16 mx-auto text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
            <p className='mt-4 text-xl font-medium'>No favorites yet</p>
            <p className='text-gray-500 mb-8'>
              Start exploring books to add to your favorites
            </p>
            <button
              onClick={() => navigate('/browse')}
              className='bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors font-medium'
            >
              Browse Books
            </button>
          </div>
        )}
      </div>
    </SimpleLayout>
  );
};

export default Favorites;
