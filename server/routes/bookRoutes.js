// server/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { Book, Author, Genre } = require('../models');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

// GET /api/books - Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        { model: Author, attributes: ['name'] },
        { model: Genre, attributes: ['name'] },
      ],
    });

    const formattedBooks = books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.Author.name,
      year: book.year,
      genre: book.Genre.name,
      image: book.image,
      pages: book.pages,
      language: book.language,
      description: book.description,
      rating: book.rating,
      ratingCount: book.ratingCount,
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/books/:id - Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        { model: Author, attributes: ['id', 'name'] },
        { model: Genre, attributes: ['id', 'name'] },
      ],
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const formattedBook = {
      id: book.id,
      title: book.title,
      author: book.Author.name,
      authorId: book.Author.id,
      year: book.year,
      genre: book.Genre.name,
      genreId: book.Genre.id,
      image: book.image,
      pages: book.pages,
      language: book.language,
      description: book.description,
      rating: book.rating,
      ratingCount: book.ratingCount,
    };

    res.json(formattedBook);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/books - Create new book (admin only)
router.post('/', authenticateUser, isAdmin, async (req, res) => {
  try {
    const {
      title,
      authorId,
      genreId,
      year,
      description,
      image,
      pages,
      language,
    } = req.body;

    const book = await Book.create({
      title,
      AuthorId: authorId,
      GenreId: genreId,
      year,
      description,
      image,
      pages,
      language,
    });

    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/books/:id - Update book (admin only)
router.put('/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.update(req.body);

    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/books/:id - Delete book (admin only)
router.delete('/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.destroy();

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
