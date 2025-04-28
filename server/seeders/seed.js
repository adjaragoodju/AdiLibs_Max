// server/seeders/seed.js
const bcrypt = require('bcrypt');
const db = require('../models');
const { User, Genre, Author, Book } = db;
const booksData = require('../../client/src/data/books.json');

// Seed database with initial data
async function seedDatabase() {
  try {
    // First, sync the database to ensure tables exist
    console.log('Synchronizing database...');
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

    console.log('Admin user created');

    // Create genres
    const uniqueGenres = [...new Set(booksData.map((book) => book.genre))];
    const genreModels = await Promise.all(
      uniqueGenres.map((genreName) => Genre.create({ name: genreName }))
    );

    console.log('Genres created');

    // Create authors
    const uniqueAuthors = [...new Set(booksData.map((book) => book.author))];
    const authorModels = await Promise.all(
      uniqueAuthors.map((authorName) => {
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

        const genreModel = genreModels.find((g) => g.name === primaryGenre);

        return Author.create({
          name: authorName,
          description: `${authorName} is a renowned author known for works in the ${primaryGenre} genre.`,
          GenreId: genreModel.id,
        });
      })
    );

    console.log('Authors created');

    // Create books
    for (const bookData of booksData) {
      const genre = genreModels.find((g) => g.name === bookData.genre);
      const author = authorModels.find((a) => a.name === bookData.author);

      await Book.create({
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
      });
    }

    console.log('Books created');

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close database connection when done
    await db.sequelize.close();
  }
}

// Call the seed function
seedDatabase();
