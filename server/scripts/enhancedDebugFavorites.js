// scripts/enhancedDebugFavorites.js
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Configuration
const PORT = process.env.PORT || 3001;
const API_URL = `http://localhost:${PORT}/api`;

// Test user credentials - use a registered user
const testUser = {
  email: 'demo@adilibs.com', // Use the demo account we created in the seed script
  password: 'admin123', // Same password as admin
};

async function enhancedDebugFavorites() {
  try {
    console.log('Starting enhanced favorites debugging...');
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

    // 3. Get all books from API
    console.log('\n3. Fetching books from API...');
    const booksResponse = await axios.get(`${API_URL}/books`);
    const apiBooks = booksResponse.data;

    if (!apiBooks.length) {
      throw new Error('No books found in API');
    }

    console.log(`Found ${apiBooks.length} books in API`);

    // 4. Get local books from JSON file
    console.log('\n4. Reading books from client JSON file...');
    const clientBooksPath = path.join(
      __dirname,
      '../client/src/data/books.json'
    );
    let localBooks;

    try {
      localBooks = JSON.parse(fs.readFileSync(clientBooksPath, 'utf8'));
      console.log(`Found ${localBooks.length} books in local JSON file`);
    } catch (fileError) {
      console.error('Error reading local books file:', fileError.message);
      localBooks = [];
    }

    // 5. Compare local books with API books
    console.log('\n5. Comparing local books with API books...');

    const matchingBooks = [];
    const missingBooks = [];

    // Check each local book
    for (const localBook of localBooks) {
      const match = apiBooks.find(
        (apiBook) =>
          apiBook.title === localBook.title &&
          apiBook.author === localBook.author
      );

      if (match) {
        matchingBooks.push({
          title: localBook.title,
          author: localBook.author,
          localData: localBook,
          apiData: match,
        });
      } else {
        missingBooks.push(localBook);
      }
    }

    console.log(`Found ${matchingBooks.length} matching books`);
    console.log(
      `Found ${missingBooks.length} books that exist locally but not in API`
    );

    if (missingBooks.length > 0) {
      console.log('First 5 missing books:');
      missingBooks.slice(0, 5).forEach((book) => {
        console.log(`- "${book.title}" by ${book.author}`);
      });
    }

    // 6. Test adding a book to favorites
    console.log('\n6. Testing adding a book to favorites...');

    if (matchingBooks.length === 0) {
      console.log('❌ No matching books to test with!');
    } else {
      // Select a book from the matching books
      const testBook = matchingBooks[0];
      console.log(
        `Selected test book: "${testBook.apiData.title}" (ID: ${testBook.apiData.id})`
      );

      try {
        const addResponse = await axios.post(
          `${API_URL}/favorites`,
          { bookId: testBook.apiData.id },
          config
        );
        console.log('✅ Book added successfully:', addResponse.data);
      } catch (addError) {
        console.error(
          '❌ Error adding book:',
          addError.response?.data || addError.message
        );
      }
    }

    // 7. Check favorites
    console.log('\n7. Checking favorites...');
    const favoritesResponse = await axios.get(`${API_URL}/favorites`, config);
    console.log(`Favorites count: ${favoritesResponse.data.length}`);

    if (favoritesResponse.data.length > 0) {
      console.log('Current favorites:');
      favoritesResponse.data.forEach((fav) => {
        console.log(`- "${fav.title}" by ${fav.author} (ID: ${fav.id})`);
      });
    } else {
      console.log('No favorites found!');
    }

    // 8. Create a mapping file to help debugging
    console.log('\n8. Creating book ID mapping file...');

    const mappingData = apiBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
    }));

    const mappingPath = path.join(__dirname, 'book-id-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(mappingData, null, 2));
    console.log(`✅ Book ID mapping saved to ${mappingPath}`);

    console.log('\nFavorites debugging complete!');

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
enhancedDebugFavorites();
