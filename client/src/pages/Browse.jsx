// src/pages/Browse.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import SimpleLayout from '../components/layout/SimpleLayout';

const Browse = () => {
  const navigate = useNavigate();
  // Only destructure what you need
  const { books, uniqueGenres, uniqueAuthors } = useBooks();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Apply filters when selections change
  useEffect(() => {
    let results = [...books];

    if (selectedGenre) {
      results = results.filter((book) => book.genre === selectedGenre);
    }

    if (selectedAuthor) {
      results = results.filter((book) => book.author === selectedAuthor);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(results);
  }, [books, selectedGenre, selectedAuthor, searchQuery]);

  const handleClearFilters = () => {
    setSelectedGenre(null);
    setSelectedAuthor(null);
    setSearchQuery('');
  };

  return (
    <>
      <SimpleLayout>
        <main className='container mx-auto px-6 py-12 mt-12'>
          <h1 className='text-4xl font-bold mb-8'>Browse Books</h1>

          {/* Filters Section */}
          <div className='bg-gray-50 p-6 rounded-lg mb-10'>
            <div className='flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 mb-6'>
              {/* Search */}
              <div className='flex-1'>
                <label
                  htmlFor='search'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Search
                </label>
                <input
                  type='text'
                  id='search'
                  className='w-full p-2 border rounded-lg'
                  placeholder='Search by title or author...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Genre Filter */}
              <div className='w-full md:w-64'>
                <label
                  htmlFor='genre'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Genre
                </label>
                <select
                  id='genre'
                  className='w-full p-2 border rounded-lg'
                  value={selectedGenre || ''}
                  onChange={(e) => setSelectedGenre(e.target.value || null)}
                >
                  <option value=''>All Genres</option>
                  {uniqueGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Filter */}
              <div className='w-full md:w-64'>
                <label
                  htmlFor='author'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Author
                </label>
                <select
                  id='author'
                  className='w-full p-2 border rounded-lg'
                  value={selectedAuthor || ''}
                  onChange={(e) => setSelectedAuthor(e.target.value || null)}
                >
                  <option value=''>All Authors</option>
                  {uniqueAuthors.map((author) => (
                    <option key={author} value={author}>
                      {author}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className='self-end'>
                <button
                  onClick={handleClearFilters}
                  className='p-2 text-gray-600 hover:text-black'
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className='text-sm text-gray-600'>
              Showing {filteredBooks.length} of {books.length} books
            </div>
          </div>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
              {filteredBooks.map((book, index) => (
                <div
                  key={index}
                  className='cursor-pointer hover:scale-105 transition-transform'
                  onClick={() =>
                    navigate(`/book/${encodeURIComponent(book.title)}`)
                  }
                >
                  <div className='h-64 bg-gray-200 rounded-lg overflow-hidden shadow-md'>
                    <img
                      src={book.image || '/placeholder-book.jpg'}
                      alt={book.title}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='mt-3'>
                    <h3 className='font-medium text-lg line-clamp-1'>
                      {book.title}
                    </h3>
                    <p className='text-gray-600'>
                      {book.author}
                      <span className='mx-2'>•</span>
                      <span className='text-gray-500'>{book.year}</span>
                    </p>
                  </div>
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
                  d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <h3 className='mt-4 text-xl font-medium'>No books found</h3>
              <p className='text-gray-500'>
                Try different search criteria or clear the filters
              </p>
            </div>
          )}
        </main>
      </SimpleLayout>
    </>
  );
};

export default Browse;
