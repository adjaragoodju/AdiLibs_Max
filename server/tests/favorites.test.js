// server/tests/favorites.test.js
const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:5000/api';

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'password123',
};

// Test function
async function testFavoritesAPI() {
  try {
    console.log('Starting favorites API test...');

    // Login to get token
    console.log('Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, testUser);
    const token = loginResponse.data.token;

    if (!token) {
      throw new Error('Failed to get authentication token');
    }

    console.log('Login successful');

    // Set token for subsequent requests
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // Get all books
    console.log('Fetching books...');
    const booksResponse = await axios.get(`${API_URL}/books`);
    const books = booksResponse.data;

    if (!books.length) {
      throw new Error('No books found');
    }

    const bookToFavorite = books[0];
    console.log(`Selected book for favorite: ${bookToFavorite.title}`);

    // Add to favorites
    console.log('Adding book to favorites...');
    await axios.post(
      `${API_URL}/favorites`,
      { bookId: bookToFavorite.id },
      config
    );

    // Get favorites
    console.log('Fetching favorites...');
    const favoritesResponse = await axios.get(`${API_URL}/favorites`, config);
    const favorites = favoritesResponse.data;

    console.log(`Favorites count: ${favorites.length}`);

    // Verify the book was added
    const foundFavorite = favorites.find((fav) => fav.id === bookToFavorite.id);
    if (!foundFavorite) {
      throw new Error('Added favorite not found');
    }

    console.log('Favorite added successfully');

    // Remove from favorites
    console.log('Removing book from favorites...');
    await axios.delete(`${API_URL}/favorites/${bookToFavorite.id}`, config);

    // Check favorites again
    const afterRemoveResponse = await axios.get(`${API_URL}/favorites`, config);
    const afterRemoveFavorites = afterRemoveResponse.data;

    const stillExists = afterRemoveFavorites.find(
      (fav) => fav.id === bookToFavorite.id
    );

    if (stillExists) {
      throw new Error('Favorite was not successfully removed');
    }

    console.log('Favorite removed successfully');
    console.log('Favorites API test completed successfully!');
  } catch (error) {
    console.error('Error during test:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testFavoritesAPI();
