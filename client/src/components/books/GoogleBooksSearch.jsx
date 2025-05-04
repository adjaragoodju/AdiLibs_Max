// client/src/components/books/GoogleBooksSearch.jsx
import React, { useState } from 'react';
import GoogleBooksService from '../../services/googleBooksApi';
import LoadingSpinner from '../ui/LoadingSpinner';

const GoogleBooksSearch = ({ onSelectBook }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const maxResults = 12; // Number of results to fetch per request

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setStartIndex(0); // Reset pagination

    try {
      const response = await GoogleBooksService.searchBooks(
        searchQuery,
        maxResults,
        0
      );
      setBooks(response);
      setTotalItems(response.length);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loading) return;

    const newStartIndex = startIndex + maxResults;
    setLoading(true);

    try {
      const moreBooks = await GoogleBooksService.searchBooks(
        searchQuery,
        maxResults,
        newStartIndex
      );

      setBooks([...books, ...moreBooks]);
      setStartIndex(newStartIndex);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-2xl font-bold mb-6'>Search Google Books</h2>

      <form onSubmit={handleSearch} className='mb-8'>
        <div className='flex flex-col md:flex-row gap-4'>
          <input
            type='text'
            className='flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
            placeholder='Search for books by title, author, or keyword...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type='submit'
            className='bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors'
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className='bg-red-50 text-red-700 p-4 rounded-lg mb-6'>
          {error}
        </div>
      )}

      {loading && books.length === 0 ? (
        <div className='flex justify-center py-12'>
          <LoadingSpinner size='lg' message='Searching books...' />
        </div>
      ) : (
        <>
          {books.length > 0 ? (
            <div>
              <h3 className='text-xl font-semibold mb-4'>
                Found {totalItems} Results
              </h3>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {books.map((book) => (
                  <div
                    key={book.id}
                    className='border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
                    onClick={() => onSelectBook(book)}
                  >
                    <div className='h-48 bg-gray-200 relative'>
                      <img
                        src={book.image}
                        alt={book.title}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                          e.target.src = '/placeholder-book.jpg';
                        }}
                      />
                    </div>
                    <div className='p-4'>
                      <h4 className='font-medium text-lg line-clamp-1'>
                        {book.title}
                      </h4>
                      <p className='text-gray-600 text-sm'>{book.author}</p>
                      <p className='text-gray-500 text-xs mt-1'>
                        {book.year} • {book.genre}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {books.length >= maxResults && (
                <div className='text-center mt-8'>
                  <button
                    onClick={handleLoadMore}
                    className='bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg transition-colors'
                    disabled={loading}
                  >
                    {loading ? (
                      <span className='flex items-center'>
                        <LoadingSpinner size='sm' color='gray' />
                        <span className='ml-2'>Loading more...</span>
                      </span>
                    ) : (
                      'Load More Books'
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : searchQuery ? (
            <div className='text-center py-12 bg-gray-50 rounded-lg'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-12 w-12 mx-auto text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <h3 className='mt-4 text-xl font-medium'>No books found</h3>
              <p className='text-gray-500 mb-6'>Try a different search term</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default GoogleBooksSearch;
