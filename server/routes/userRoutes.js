// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');

// GET /api/users/profile - Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    // User data from auth middleware, excluding password
    const userData = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      profileImage: req.user.profileImage,
      isAdmin: req.user.isAdmin,
      createdAt: req.user.createdAt,
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { username, email, profileImage } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    // Return updated user data
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    };

    res.json(userData);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/password - Change password
router.put('/password', authenticateUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users - Admin only - Get all users
router.get('/', authenticateUser, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
