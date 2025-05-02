// scripts/debugFavorites.js
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

async function debugFavorites() {
  try {
    console.log('Starting favorites debugging...');
    console.log(`Using API URL: ${API_URL}`);

    // 1. Login to get token
    console.log('\n1. Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, testUser);
    const token = loginResponse.data.token;

    if (!token) {
      throw new Error('Failed to get authentication token');
    }

    console.log(`✅ Login successful: ${loginResponse.data.user.username}`);

    // Set token for subsequent requests
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // 2. Clear all favorites for a clean start
    console.log('\n2. Clearing all favorites...');
    try {
      await axios.delete(`${API_URL}/favorites/all`, config);
      console.log('✅ All favorites cleared');
    } catch (clearError) {
      console.error(
        'Error clearing favorites:',
        clearError.response?.data || clearError.message
      );
    }

    // 3. Get all books
    console.log('\n3. Fetching books...');
    const booksResponse = await axios.get(`${API_URL}/books`);
    const books = booksResponse.data;

    if (!books.length) {
      throw new Error('No books found');
    }

    console.log(`Found ${books.length} books`);

    // Pick 3 books to test with
    const testBooks = [books[0], books[1], books[2]];
    console.log('Selected test books:');
    testBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" (ID: ${book.id})`);
    });

    // 4. Check current favorites (should be empty)
    console.log('\n4. Checking current favorites...');
    const initialFavoritesResponse = await axios.get(
      `${API_URL}/favorites`,
      config
    );
    console.log(
      `Initial favorites count: ${initialFavoritesResponse.data.length}`
    );

    // 5. Add first book to favorites
    console.log('\n5. Adding first book to favorites...');
    try {
      const addResponse = await axios.post(
        `${API_URL}/favorites`,
        { bookId: testBooks[0].id },
        config
      );
      console.log('✅ First book added:', addResponse.data);
    } catch (addError) {
      console.error(
        '❌ Error adding first book:',
        addError.response?.data || addError.message
      );
    }

    // 6. Check favorites again (should have 1 book)
    console.log('\n6. Checking favorites after first add...');
    const midFavoritesResponse = await axios.get(
      `${API_URL}/favorites`,
      config
    );
    console.log(`Favorites count: ${midFavoritesResponse.data.length}`);
    if (midFavoritesResponse.data.length > 0) {
      console.log(
        'Current favorites:',
        midFavoritesResponse.data.map((f) => `"${f.title}" (ID: ${f.id})`)
      );
    }

    // 7. Add second book to favorites
    console.log('\n7. Adding second book to favorites...');
    try {
      const secondAddResponse = await axios.post(
        `${API_URL}/favorites`,
        { bookId: testBooks[1].id },
        config
      );
      console.log('✅ Second book added:', secondAddResponse.data);
    } catch (addError) {
      console.error(
        '❌ Error adding second book:',
        addError.response?.data || addError.message
      );
    }

    // 8. Try adding the first book again (should fail with 400)
    console.log('\n8. Trying to add first book again (should fail)...');
    try {
      await axios.post(
        `${API_URL}/favorites`,
        { bookId: testBooks[0].id },
        config
      );
      console.log('❌ Warning: Added duplicate book (should have failed)');
    } catch (dupeError) {
      if (dupeError.response?.status === 400) {
        console.log(
          '✅ Expected error when adding duplicate:',
          dupeError.response.data
        );
      } else {
        console.error(
          '❌ Unexpected error:',
          dupeError.response?.data || dupeError.message
        );
      }
    }

    // 9. Check favorites one more time (should have 2 books)
    console.log('\n9. Checking final favorites count...');
    const finalFavoritesResponse = await axios.get(
      `${API_URL}/favorites`,
      config
    );
    console.log(`Final favorites count: ${finalFavoritesResponse.data.length}`);
    if (finalFavoritesResponse.data.length > 0) {
      console.log(
        'Final favorites:',
        finalFavoritesResponse.data.map((f) => `"${f.title}" (ID: ${f.id})`)
      );
    }

    // 10. Remove a book from favorites
    if (finalFavoritesResponse.data.length > 0) {
      console.log('\n10. Removing a book from favorites...');
      const bookToRemove = finalFavoritesResponse.data[0];
      try {
        const removeResponse = await axios.delete(
          `${API_URL}/favorites/${bookToRemove.id}`,
          config
        );
        console.log(`✅ Removed "${bookToRemove.title}":`, removeResponse.data);
      } catch (removeError) {
        console.error(
          '❌ Error removing book:',
          removeError.response?.data || removeError.message
        );
      }
    }

    console.log('\nFavorites debugging complete!');

    // Helpful notes for fixing any remaining issues
    console.log('\nHELPFUL TIPS:');
    console.log('- Make sure book IDs match between frontend and database');
    console.log('- Check that the Authorization header is correctly set');
    console.log(
      '- Ensure your FavoritesContext.jsx sends the bookId parameter'
    );
    console.log('- Add console.logs in your frontend code to track the flow');

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

// Run the debug function
debugFavorites();
