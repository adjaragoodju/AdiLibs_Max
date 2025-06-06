// server/controllers/favoriteController.js
const { Favorite, Book, Author, Genre } = require('../models');

// Get user's favorites
exports.getUserFavorites = async (req, res) => {
  try {
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
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a book to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { bookId } = req.body;

    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
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
      return res.status(400).json({ message: 'Book already in favorites' });
    }

    // Add to favorites
    const favorite = await Favorite.create({
      UserId: req.user.id,
      BookId: bookId,
    });

    res.status(201).json({
      message: 'Book added to favorites',
      favoriteId: favorite.id,
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a book from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find and remove from favorites
    const favorite = await Favorite.findOne({
      where: {
        UserId: req.user.id,
        BookId: bookId,
      },
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Book not found in favorites' });
    }

    await favorite.destroy();

    res.json({ message: 'Book removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
