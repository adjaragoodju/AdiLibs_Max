// client/src/hooks/useGoogleBooks.js
import { useState, useCallback } from 'react';
import GoogleBooksService from '../services/googleBooksApi';

/**
 * Custom hook for working with Google Books API
 */
export function useGoogleBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [searchInfo, setSearchInfo] = useState({
    query: '',
    startIndex: 0,
    maxResults: 10,
  });

  /**
   * Search for books using the Google Books API
   * @param {string} query - Search query
   * @param {number} maxResults - Maximum number of results to return
   * @param {number} startIndex - Starting index for pagination
   */
  const searchBooks = useCallback(
    async (query, maxResults = 10, startIndex = 0) => {
      if (!query.trim()) return;

      setLoading(true);
      setError(null);

      try {
        const response = await GoogleBooksService.searchBooks(
          query,
          maxResults,
          startIndex
        );

        // If startIndex is 0, replace the results, otherwise append
        if (startIndex === 0) {
          setBooks(response);
        } else {
          setBooks((prev) => [...prev, ...response]);
        }

        setSearchInfo({
          query,
          startIndex: startIndex + maxResults,
          maxResults,
        });

        setTotalItems(response.length > 0 ? response.length : 0);
        setLoading(false);
      } catch (err) {
        console.error('Error searching books:', err);
        setError('Failed to search books. Please try again.');
        setLoading(false);
      }
    },
    []
  );

  /**
   * Load more books with the current search parameters
   */
  const loadMoreBooks = useCallback(async () => {
    if (loading || !searchInfo.query) return;

    setLoading(true);

    try {
      const { query, startIndex, maxResults } = searchInfo;
      const moreBooks = await GoogleBooksService.searchBooks(
        query,
        maxResults,
        startIndex
      );

      setBooks((prev) => [...prev, ...moreBooks]);
      setSearchInfo((prev) => ({
        ...prev,
        startIndex: prev.startIndex + prev.maxResults,
      }));

      setLoading(false);
    } catch (err) {
      console.error('Error loading more books:', err);
      setError('Failed to load more books. Please try again.');
      setLoading(false);
    }
  }, [loading, searchInfo]);

  /**
   * Get detailed information about a book by ID
   * @param {string} bookId - Google Books volume ID
   */
  const getBookById = useCallback(async (bookId) => {
    setLoading(true);
    setError(null);

    try {
      const bookDetails = await GoogleBooksService.getBookDetails(bookId);
      setLoading(false);
      return bookDetails;
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Failed to fetch book details. Please try again.');
      setLoading(false);
      return null;
    }
  }, []);

  /**
   * Clear the current search results
   */
  const clearResults = useCallback(() => {
    setBooks([]);
    setTotalItems(0);
    setSearchInfo({
      query: '',
      startIndex: 0,
      maxResults: 10,
    });
  }, []);

  return {
    books,
    loading,
    error,
    totalItems,
    searchInfo,
    searchBooks,
    loadMoreBooks,
    getBookById,
    clearResults,
  };
}
