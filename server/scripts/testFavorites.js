// scripts/testFavorites.js
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const PORT = process.env.PORT || 3001;
const API_URL = `http://localhost:${PORT}/api`;

// Test user credentials - use a registered user
const testUser = {
  email: 'admin@adilibs.com', // Replace with a valid email from your database
  password: 'admin123', // Replace with the correct password
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

    console.log('Login successful:', loginResponse.data.user.username);

    // Set token for subsequent requests
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // Get all books
    console.log('\nFetching books...');
    const booksResponse = await axios.get(`${API_URL}/books`);
    const books = booksResponse.data;

    if (!books.length) {
      throw new Error('No books found');
    }

    console.log(`Found ${books.length} books`);
    const bookToFavorite = books[0];
    console.log(
      `Selected book for favorite: "${bookToFavorite.title}" (ID: ${bookToFavorite.id})`
    );

    // Add to favorites
    console.log('\nAdding book to favorites...');
    try {
      const addResponse = await axios.post(
        `${API_URL}/favorites`,
        { bookId: bookToFavorite.id },
        config
      );
      console.log('Add favorite response:', addResponse.data);
    } catch (addError) {
      if (addError.response && addError.response.status === 400) {
        console.log('Book was already in favorites');
      } else {
        throw addError;
      }
    }

    // Get favorites
    console.log('\nFetching favorites...');
    const favoritesResponse = await axios.get(`${API_URL}/favorites`, config);
    const favorites = favoritesResponse.data;

    console.log(`Favorites count: ${favorites.length}`);

    if (favorites.length > 0) {
      console.log(
        'Favorites:',
        favorites.map((f) => ({ title: f.title, id: f.id }))
      );
    }

    // Verify the book was added
    const foundFavorite = favorites.find((fav) => fav.id === bookToFavorite.id);
    if (
      !foundFavorite &&
      favorites.find((fav) => fav.title === bookToFavorite.title)
    ) {
      console.log(
        'Found the book by title but not by ID - potential ID mismatch issue'
      );
    } else if (!foundFavorite) {
      console.log('⚠️ Added favorite not found in retrieved favorites list');
    } else {
      console.log('✅ Favorite added successfully and verified');
    }

    // Remove from favorites
    console.log('\nRemoving book from favorites...');
    try {
      await axios.delete(`${API_URL}/favorites/${bookToFavorite.id}`, config);
      console.log('Remove favorite response: Success');
    } catch (removeError) {
      console.error(
        'Error removing favorite:',
        removeError.response?.data || removeError.message
      );
    }

    // Check favorites again
    const afterRemoveResponse = await axios.get(`${API_URL}/favorites`, config);
    const afterRemoveFavorites = afterRemoveResponse.data;

    const stillExists = afterRemoveFavorites.find(
      (fav) => fav.id === bookToFavorite.id
    );

    if (stillExists) {
      console.log('⚠️ Favorite was not successfully removed');
    } else {
      console.log('✅ Favorite removed successfully');
    }

    console.log('\nFavorites API test completed!');
    return true;
  } catch (error) {
    console.error('Error during test:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
}

// Run the test
testFavoritesAPI();
