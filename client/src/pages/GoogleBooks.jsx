// client/src/pages/GoogleBooks.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleLayout from '../components/layout/SimpleLayout';
import GoogleBooksSearch from '../components/books/GoogleBooksSearch';
import GoogleBooksService from '../services/googleBooksApi';
import BookModal from '../components/books/BookModal';

const GoogleBooks = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSelectBook = (book) => {
    // Navigate to book detail page with the book data
    navigate(`/google-book/${book.googleBooksId || book.id}`, {
      state: { book },
    });
  };

  const handleModalClose = () => {
    setSelectedBook(null);
  };

  return (
    <SimpleLayout>
      <div className='container mx-auto px-6 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Explore Google Books</h1>

        <div className='bg-gray-50 p-6 rounded-lg shadow-sm mb-8'>
          <p className='text-gray-700'>
            Search millions of books from the Google Books library. Find new
            books to read, research topics, or discover classics that you can
            add to your favorites.
          </p>
        </div>

        <GoogleBooksSearch onSelectBook={handleSelectBook} />
      </div>

      {selectedBook && (
        <BookModal
          selectedBook={selectedBook}
          setSelectedBook={handleModalClose}
        />
      )}
    </SimpleLayout>
  );
};

export default GoogleBooks;
