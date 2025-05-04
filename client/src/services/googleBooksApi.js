// client/src/services/googleBooksApi.js
import axios from 'axios';

// Google Books API base URL
const API_BASE_URL = 'https://www.googleapis.com/books/v1';

// You should ideally store your API key in an environment variable
// For development purposes, we'll include it directly here
const API_KEY = 'AIzaSyB0xccIaGVfYzTaj0mJUm0qnbimjmh1UGY';

/**
 * Service for interacting with Google Books API
 */
class GoogleBooksService {
  /**
   * Search for books using the Google Books API
   * @param {string} query - Search query
   * @param {number} maxResults - Maximum number of results to return (default: 10)
   * @param {number} startIndex - Starting index for pagination (default: 0)
   * @return {Promise} - Promise resolving to search results
   */
  static async searchBooks(query, maxResults = 10, startIndex = 0) {
    try {
      const response = await axios.get(`${API_BASE_URL}/volumes`, {
        params: {
          q: query,
          maxResults,
          startIndex,
          key: API_KEY,
        },
      });

      return this.formatSearchResults(response.data);
    } catch (error) {
      console.error('Error searching Google Books:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific book by ID
   * @param {string} bookId - Google Books volume ID
   * @return {Promise} - Promise resolving to book details
   */
  static async getBookDetails(bookId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/volumes/${bookId}`, {
        params: {
          key: API_KEY,
        },
      });

      return this.formatBookDetails(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw error;
    }
  }

  /**
   * Format search results to match our application's data structure
   * @param {Object} data - Raw API response
   * @return {Array} - Formatted books array
   */
  static formatSearchResults(data) {
    if (!data.items) return [];

    return data.items.map((item) => this.formatBookDetails(item));
  }

  /**
   * Format a single book to match our application's data structure
   * @param {Object} item - Raw book data from API
   * @return {Object} - Formatted book object
   */
  static formatBookDetails(item) {
    const volumeInfo = item.volumeInfo || {};
    const saleInfo = item.saleInfo || {};

    return {
      id: item.id,
      googleBooksId: item.id, // Store the Google Books ID separately
      title: volumeInfo.title || 'Unknown Title',
      author: volumeInfo.authors
        ? volumeInfo.authors.join(', ')
        : 'Unknown Author',
      year: volumeInfo.publishedDate
        ? volumeInfo.publishedDate.substring(0, 4)
        : 'Unknown',
      genre: volumeInfo.categories ? volumeInfo.categories[0] : 'Unknown',
      description: volumeInfo.description || 'No description available.',
      image: volumeInfo.imageLinks
        ? volumeInfo.imageLinks.thumbnail
        : '/placeholder-book.jpg',
      pages: volumeInfo.pageCount || 0,
      language: volumeInfo.language || 'en',
      rating: volumeInfo.averageRating || 0,
      ratingCount: volumeInfo.ratingsCount || 0,
      preview: volumeInfo.previewLink || null,
      price: saleInfo.listPrice
        ? `${saleInfo.listPrice.amount} ${saleInfo.listPrice.currencyCode}`
        : 'Not for sale',
      isGoogleBook: true, // Flag to indicate this is from Google Books API
    };
  }
}

export default GoogleBooksService;
