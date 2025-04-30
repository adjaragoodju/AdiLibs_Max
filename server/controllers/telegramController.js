// controllers/telegramController.js
const { TelegramSubscriber } = require('../models');

// Handle newsletter subscription via Telegram
exports.subscribe = async (req, res) => {
  console.log('Received subscription request:', req.body);

  try {
    const { username } = req.body;

    if (!username) {
      console.log('Subscription rejected: No username provided');
      return res.status(400).json({ message: 'Telegram username is required' });
    }

    // Format username (remove @ if present for consistency)
    const formattedUsername = username.startsWith('@')
      ? username.substring(1)
      : username;
    console.log(`Processing subscription for username: ${formattedUsername}`);

    // Check if already subscribed
    const existingSubscriber = await TelegramSubscriber.findOne({
      where: { username: formattedUsername },
    });

    if (existingSubscriber) {
      console.log(
        `Subscription rejected: ${formattedUsername} is already subscribed`
      );
      return res.status(400).json({
        message: 'This Telegram username is already subscribed',
      });
    }

    // Create a new subscriber directly
    console.log(`Creating new subscriber for: ${formattedUsername}`);
    const subscriber = await TelegramSubscriber.create({
      username: formattedUsername,
      isActive: true,
      subscribedAt: new Date(),
      preferredGenres: '',
      receivePromotions: true,
      receiveNewReleases: true,
    });

    console.log(`Subscriber created with ID: ${subscriber.id}`);

    // Return success response
    res.status(201).json({
      message: 'Successfully subscribed to Telegram updates',
      subscriber: {
        id: subscriber.id,
        username: subscriber.username,
        subscribedAt: subscriber.subscribedAt,
      },
    });
  } catch (error) {
    console.error('Error in Telegram subscription:', error);

    // Detailed error logging
    if (error.name === 'SequelizeValidationError') {
      console.error('Validation error:', error.errors);
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((e) => e.message),
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Unique constraint error:', error.errors);
      return res.status(400).json({
        message: 'This Telegram username is already subscribed',
      });
    }

    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Handle webhook updates from Telegram
exports.handleWebhook = async (req, res) => {
  console.log('Received webhook update from Telegram');

  try {
    const update = req.body;

    if (!update) {
      console.log('Webhook rejected: No update data');
      return res.status(400).json({ message: 'Invalid update data' });
    }

    console.log(
      'Processing Telegram update:',
      JSON.stringify(update).substring(0, 200) + '...'
    );

    // Send a 200 OK response quickly to acknowledge receipt
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling Telegram webhook:', error);
    // Still return 200 to Telegram to avoid repeated deliveries
    res.status(200).json({ success: false, error: error.message });
  }
};
