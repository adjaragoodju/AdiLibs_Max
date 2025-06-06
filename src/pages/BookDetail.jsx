// src/pages/BookDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import booksData from '../data/books.json';
import SimpleLayout from '../components/layout/SimpleLayout';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  useEffect(() => {
    // This will be replaced with an API call later
    // For now, we'll use the local data
    const foundBook = booksData.find(
      (book) => book.title === decodeURIComponent(id)
    );
    setBook(foundBook);
  }, [id]);

  if (!book) {
    return (
      <SimpleLayout>
        <div className='text-center py-16'>
          <div className='w-16 h-16 mx-auto mb-4 border-t-4 border-b-4 border-black rounded-full animate-spin'></div>
          <p className='text-xl font-medium'>Loading book details...</p>
        </div>
      </SimpleLayout>
    );
  }

  const isInFavorites = favorites.some(
    (fav) => fav.title === book.title && fav.author === book.author
  );

  const handleFavoritesToggle = () => {
    if (isInFavorites) {
      removeFromFavorites(book);
    } else {
      addToFavorites(book);
    }
  };

  return (
    <SimpleLayout>
      <div className='mb-6'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center text-gray-600 hover:text-black'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-1'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
              clipRule='evenodd'
            />
          </svg>
          Back
        </button>
      </div>

      <div className='flex flex-col md:flex-row gap-8'>
        <div className='md:w-1/3'>
          <img
            src={book.image || '/placeholder-book.jpg'}
            alt={book.title}
            className='w-full h-auto object-cover rounded-lg shadow-lg'
            onError={(e) => {
              e.target.src = '/placeholder-book.jpg'; // Fallback image
            }}
          />

          {/* Book Details */}
          <div className='mt-6 space-y-3'>
            <div className='flex items-center'>
              <span className='text-gray-500'>Published:</span>
              <span className='ml-auto'>{book.year}</span>
            </div>
            <div className='flex items-center'>
              <span className='text-gray-500'>Genre:</span>
              <span className='ml-auto'>{book.genre}</span>
            </div>
            <div className='flex items-center'>
              <span className='text-gray-500'>Pages:</span>
              <span className='ml-auto'>{book.pages || '320'}</span>
            </div>
            <div className='flex items-center'>
              <span className='text-gray-500'>Language:</span>
              <span className='ml-auto'>{book.language || 'English'}</span>
            </div>
          </div>
        </div>

        <div className='md:w-2/3'>
          <h1 className='text-3xl font-bold mb-2'>{book.title}</h1>
          <p className='text-xl text-gray-600 mb-4'>by {book.author}</p>

          {/* Rating */}
          <div className='flex items-center mb-6'>
            <div className='flex'>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill={star <= (book.rating || 4) ? '#000000' : '#D1D5DB'}
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              ))}
            </div>
            <span className='text-gray-600 ml-2'>
              {book.ratingCount || '124'} reviews
            </span>
          </div>

          <div className='mb-6'>
            <span className='text-sm bg-gray-100 text-gray-700 inline-block px-3 py-1 rounded-full'>
              {book.genre}
            </span>
          </div>

          <div className='mb-8'>
            <h3 className='text-xl font-semibold mb-3'>About the Book</h3>
            <p className='text-gray-700 leading-relaxed'>
              {book.description ||
                `${
                  book.title
                } is a ${book.genre.toLowerCase()} novel written by ${
                  book.author
                } and published in ${
                  book.year
                }. This captivating book takes readers on an unforgettable journey through imagination and adventure. With compelling characters and an engaging plot, it has become a favorite among readers worldwide.`}
            </p>
          </div>

          <div className='flex flex-wrap gap-4'>
            <button
              className={`${
                isInFavorites
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-black hover:bg-gray-800'
              } text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center`}
              onClick={handleFavoritesToggle}
              aria-label={
                isInFavorites ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
                fill={isInFavorites ? 'currentColor' : 'none'}
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
              {isInFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <button className='border border-black text-black hover:bg-gray-100 px-6 py-3 rounded-lg transition-colors font-medium flex items-center'>
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
                  d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                />
              </svg>
              Read
            </button>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default BookDetail;
