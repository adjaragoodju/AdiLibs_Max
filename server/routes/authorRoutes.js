// server/routes/authorRoutes.js
const express = require('express');
const router = express.Router();
const { Author, Book, Genre } = require('../models');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

// GET /api/authors - Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.findAll({
      include: [{ model: Genre, attributes: ['name'] }],
    });

    res.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/authors/:id - Get author by ID
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id, {
      include: [
        { model: Genre, attributes: ['name'] },
        {
          model: Book,
          include: [{ model: Genre, attributes: ['name'] }],
        },
      ],
    });

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json(author);
  } catch (error) {
    console.error('Error fetching author:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/authors - Create new author (admin only)
router.post('/', authenticateUser, isAdmin, async (req, res) => {
  try {
    const { name, description, image, genreId } = req.body;

    const author = await Author.create({
      name,
      description,
      image,
      GenreId: genreId,
    });

    res.status(201).json(author);
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/authors/:id - Update author (admin only)
router.put('/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    await author.update(req.body);

    res.json(author);
  } catch (error) {
    console.error('Error updating author:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/authors/:id - Delete author (admin only)
router.delete('/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    await author.destroy();

    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    console.error('Error deleting author:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
