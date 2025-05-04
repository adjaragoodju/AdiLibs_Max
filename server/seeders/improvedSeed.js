// server/seeders/improvedSeed.js
const bcrypt = require('bcrypt');
const db = require('../models');
const { User, Genre, Author, Book, TelegramSubscriber } = db;
const fs = require('fs');
const path = require('path');

// Path to the books JSON file
const booksJsonPath = path.join(__dirname, '../../client/src/data/books.json');

// Seed database with initial data
async function seedDatabase() {
  try {
    console.log('Starting database seeding process...');

    // Read books data from client's JSON file
    console.log(`Reading book data from ${booksJsonPath}`);
    const booksData = JSON.parse(fs.readFileSync(booksJsonPath, 'utf8'));
    console.log(`Found ${booksData.length} books in JSON file`);

    // First, check if database is already seeded
    const existingUsers = await User.findAll();
    if (existingUsers.length > 0) {
      console.log(
        'Database already has users. Checking if we need to add missing data...'
      );

      // We'll still proceed to ensure all books exist, but we won't force sync
      await addMissingData(booksData);
      return;
    }

    // If no users exist, we'll sync and create everything from scratch
    console.log('No existing users found. Synchronizing database...');
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized!');

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      email: 'admin@adilibs.com',
      password: hashedPassword,
      isAdmin: true,
    });

    // Create a demo user for testing
    await User.create({
      username: 'demo',
      email: 'demo@adilibs.com',
      password: hashedPassword,
      isAdmin: false,
    });

    console.log('Admin and demo users created');

    // Create genres
    console.log('Creating genres...');
    const uniqueGenres = [...new Set(booksData.map((book) => book.genre))];
    const genreMap = {};

    for (const genreName of uniqueGenres) {
      const genre = await Genre.create({ name: genreName });
      genreMap[genreName] = genre;
      console.log(`Created genre: ${genreName} (ID: ${genre.id})`);
    }

    // Create authors
    console.log('Creating authors...');
    const uniqueAuthors = [...new Set(booksData.map((book) => book.author))];
    const authorMap = {};

    for (const authorName of uniqueAuthors) {
      // Find the most common genre for this author
      const booksForAuthor = booksData.filter(
        (book) => book.author === authorName
      );
      const genreCounts = {};
      booksForAuthor.forEach((book) => {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
      });

      const primaryGenre = Object.keys(genreCounts).reduce((a, b) =>
        genreCounts[a] > genreCounts[b] ? a : b
      );

      const genreId = genreMap[primaryGenre].id;

      const author = await Author.create({
        name: authorName,
        description: `${authorName} is a renowned author known for works in the ${primaryGenre} genre.`,
        GenreId: genreId,
      });

      authorMap[authorName] = author;
      console.log(`Created author: ${authorName} (ID: ${author.id})`);
    }

    // Create books
    console.log('Creating books...');
    for (const bookData of booksData) {
      const genre = genreMap[bookData.genre];
      const author = authorMap[bookData.author];

      const book = await Book.create({
        title: bookData.title,
        year: bookData.year,
        description: `${
          bookData.title
        } is a ${bookData.genre.toLowerCase()} book written by ${
          bookData.author
        } and published in ${bookData.year}.`,
        image: bookData.image,
        AuthorId: author.id,
        GenreId: genre.id,
        pages: Math.floor(Math.random() * 400) + 100, // Random pages between 100-500
        language: 'English',
        rating: Math.random() * 2 + 3, // Random rating between 3.0-5.0
        ratingCount: Math.floor(Math.random() * 1000) + 50, // Random count between 50-1050
      });

      console.log(`Created book: ${bookData.title} (ID: ${book.id})`);
    }

    // Initialize Telegram subscriber table
    console.log('Creating Telegram subscribers table...');
    await TelegramSubscriber.sync();

    console.log('Database seeded successfully');

    // Write a mapping file to help with debugging
    writeBookMappingFile();
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close database connection when done
    await db.sequelize.close();
  }
}

// Function to add missing data without resetting the database
async function addMissingData(booksData) {
  try {
    console.log('Checking for missing genres...');
    const existingGenres = await Genre.findAll();
    const existingGenreNames = existingGenres.map((g) => g.name);
    const genreMap = {};

    // Add existing genres to the map
    existingGenres.forEach((genre) => {
      genreMap[genre.name] = genre;
    });

    // Create missing genres
    const uniqueGenres = [...new Set(booksData.map((book) => book.genre))];
    for (const genreName of uniqueGenres) {
      if (!existingGenreNames.includes(genreName)) {
        const genre = await Genre.create({ name: genreName });
        genreMap[genreName] = genre;
        console.log(`Created missing genre: ${genreName} (ID: ${genre.id})`);
      }
    }

    console.log('Checking for missing authors...');
    const existingAuthors = await Author.findAll();
    const existingAuthorNames = existingAuthors.map((a) => a.name);
    const authorMap = {};

    // Add existing authors to the map
    existingAuthors.forEach((author) => {
      authorMap[author.name] = author;
    });

    // Create missing authors
    const uniqueAuthors = [...new Set(booksData.map((book) => book.author))];
    for (const authorName of uniqueAuthors) {
      if (!existingAuthorNames.includes(authorName)) {
        // Find author's primary genre
        const booksForAuthor = booksData.filter(
          (book) => book.author === authorName
        );
        const genreCounts = {};
        booksForAuthor.forEach((book) => {
          genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
        });

        const primaryGenre = Object.keys(genreCounts).reduce((a, b) =>
          genreCounts[a] > genreCounts[b] ? a : b
        );

        const genreId = genreMap[primaryGenre].id;

        const author = await Author.create({
          name: authorName,
          description: `${authorName} is a renowned author known for works in the ${primaryGenre} genre.`,
          GenreId: genreId,
        });

        authorMap[authorName] = author;
        console.log(`Created missing author: ${authorName} (ID: ${author.id})`);
      }
    }

    console.log('Checking for missing books...');
    const existingBooks = await Book.findAll({
      include: [
        { model: Author, attributes: ['name'] },
        { model: Genre, attributes: ['name'] },
      ],
    });

    // Create a map of existing books by title+author for quick lookup
    const existingBookMap = {};
    existingBooks.forEach((book) => {
      const key = `${book.title}|${book.Author.name}`;
      existingBookMap[key] = book;
    });

    // Check for missing books
    let addedBooks = 0;
    for (const bookData of booksData) {
      const key = `${bookData.title}|${bookData.author}`;

      if (!existingBookMap[key]) {
        const genre = genreMap[bookData.genre];
        const author = authorMap[bookData.author];

        if (!genre || !author) {
          console.error(`Missing genre or author for book: ${bookData.title}`);
          continue;
        }

        const book = await Book.create({
          title: bookData.title,
          year: bookData.year,
          description: `${
            bookData.title
          } is a ${bookData.genre.toLowerCase()} book written by ${
            bookData.author
          } and published in ${bookData.year}.`,
          image: bookData.image,
          AuthorId: author.id,
          GenreId: genre.id,
          pages: Math.floor(Math.random() * 400) + 100, // Random pages between 100-500
          language: 'English',
          rating: Math.random() * 2 + 3, // Random rating between 3.0-5.0
          ratingCount: Math.floor(Math.random() * 1000) + 50, // Random count between 50-1050
        });

        addedBooks++;
        console.log(`Created missing book: ${bookData.title} (ID: ${book.id})`);
      }
    }

    console.log(`Added ${addedBooks} missing books to the database`);

    // Write a mapping file to help with debugging
    writeBookMappingFile();
  } catch (error) {
    console.error('Error adding missing data:', error);
  }
}

// Function to write a mapping file for debugging
async function writeBookMappingFile() {
  try {
    // Get all books with their relationships
    const books = await Book.findAll({
      include: [
        { model: Author, attributes: ['name'] },
        { model: Genre, attributes: ['name'] },
      ],
    });

    // Create a mapping object
    const bookMapping = books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.Author.name,
      genre: book.Genre.name,
      year: book.year,
      image: book.image,
    }));

    // Write the mapping to a file
    const mappingPath = path.join(__dirname, 'book-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(bookMapping, null, 2));
    console.log(`Book mapping written to ${mappingPath} for reference`);
  } catch (error) {
    console.error('Error writing book mapping file:', error);
  }
}

// If this script is run directly, call the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, addMissingData };
