// server/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const { Favorite, Book, Author, Genre } = require('../models');
const { authenticateUser } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateUser);

// GET /api/favorites - Get user's favorites
router.get('/', async (req, res) => {
  try {
    console.log(`Fetching favorites for user ID: ${req.user.id}`);

    const favorites = await Favorite.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Book,
          include: [
            { model: Author, attributes: ['name'] },
            { model: Genre, attributes: ['name'] },
          ],
        },
      ],
    });

    console.log(`Found ${favorites.length} favorites for user`);

    // Format the response to match frontend expectations
    const formattedFavorites = favorites.map((favorite) => ({
      id: favorite.Book.id,
      title: favorite.Book.title,
      author: favorite.Book.Author.name,
      year: favorite.Book.year,
      genre: favorite.Book.Genre.name,
      image: favorite.Book.image,
      pages: favorite.Book.pages,
      language: favorite.Book.language,
      description: favorite.Book.description,
      rating: favorite.Book.rating,
      ratingCount: favorite.Book.ratingCount,
    }));

    res.json(formattedFavorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/favorites - Add a book to favorites
router.post('/', async (req, res) => {
  try {
    const { bookId } = req.body;
    console.log(
      `Adding book ID ${bookId} to favorites for user ID ${req.user.id}`
    );

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      console.log(`Book ID ${bookId} not found in database`);
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      where: {
        UserId: req.user.id,
        BookId: bookId,
      },
    });

    if (existingFavorite) {
      console.log(
        `Book ID ${bookId} is already in favorites for user ID ${req.user.id}`
      );
      return res.status(400).json({ message: 'Book already in favorites' });
    }

    // Add to favorites
    const favorite = await Favorite.create({
      UserId: req.user.id,
      BookId: bookId,
    });

    console.log(`Created favorite with ID ${favorite.id}`);

    // Return more details about the created favorite
    res.status(201).json({
      message: 'Book added to favorites',
      favoriteId: favorite.id,
      bookId: bookId,
      userId: req.user.id,
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/favorites/:id - Remove a book from favorites
router.delete('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;

    // Special case for /api/favorites/all route
    if (bookId === 'all') {
      console.log(`Removing all favorites for user ID ${req.user.id}`);

      // Delete all favorites for this user
      const result = await Favorite.destroy({
        where: {
          UserId: req.user.id,
        },
      });

      console.log(`Removed ${result} favorites for user ID ${req.user.id}`);

      return res.json({
        message: 'All favorites removed successfully',
        count: result,
      });
    }

    console.log(
      `Removing book ID ${bookId} from favorites for user ID ${req.user.id}`
    );

    // Find and remove from favorites
    const favorite = await Favorite.findOne({
      where: {
        UserId: req.user.id,
        BookId: bookId,
      },
    });

    if (!favorite) {
      console.log(
        `Book ID ${bookId} not found in favorites for user ID ${req.user.id}`
      );
      return res.status(404).json({ message: 'Book not found in favorites' });
    }

    await favorite.destroy();
    console.log(
      `Removed book ID ${bookId} from favorites for user ID ${req.user.id}`
    );

    res.json({ message: 'Book removed from favorites', bookId });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
