// server/routes/telegramRoutes.js
const express = require('express');
const router = express.Router();
const telegramController = require('../controllers/telegramController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

// Public routes
// POST /api/telegram/subscribe - Subscribe to Telegram updates
router.post('/subscribe', telegramController.subscribe);

// POST /api/telegram/webhook - Handle Telegram webhook updates
// This should be set as the webhook URL in Telegram Bot API
router.post('/webhook', telegramController.handleWebhook);

// Protected routes (require authentication)
// POST /api/telegram/test-message - Send a test message (admin only)
router.post(
  '/test-message',
  authenticateUser,
  isAdmin,
  telegramController.sendTestMessage
);

// POST /api/telegram/broadcast - Broadcast message to all subscribers (admin only)
router.post(
  '/broadcast',
  authenticateUser,
  isAdmin,
  telegramController.broadcastMessage
);

// POST /api/telegram/setup-webhook - Set up the webhook URL (admin only)
router.post(
  '/setup-webhook',
  authenticateUser,
  isAdmin,
  telegramController.setupWebhook
);

module.exports = router;
