// server/services/telegramService.js
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Telegram Bot API token should be set in .env file
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Service for interacting with Telegram Bot API
 */
class TelegramService {
  /**
   * Send a message to a specific chat
   * @param {string} chatId - Telegram chat ID
   * @param {string} text - Message text
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Telegram API response
   */
  static async sendMessage(chatId, text, options = {}) {
    try {
      const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending Telegram message:', error.message);
      throw error;
    }
  }

  /**
   * Send a message to all subscribers
   * @param {string} text - Message text
   * @param {Array<string>} subscriberIds - Array of subscriber chat IDs
   * @returns {Promise<Array>} - Array of responses
   */
  static async broadcastMessage(text, subscriberIds) {
    const results = [];
    for (const chatId of subscriberIds) {
      try {
        const result = await this.sendMessage(chatId, text);
        results.push({ chatId, success: true, result });
      } catch (error) {
        results.push({ chatId, success: false, error: error.message });
      }
    }
    return results;
  }

  /**
   * Register and save a new Telegram subscriber
   * @param {string} username - Telegram username (with or without '@')
   * @param {Object} db - Database instance
   * @returns {Promise<Object>} - Saved subscriber object
   */
  static async registerSubscriber(username, db) {
    try {
      // Format username (remove @ if present)
      const formattedUsername = username.startsWith('@')
        ? username.substring(1)
        : username;

      // In a real implementation, you would:
      // 1. Save the subscriber to your database
      // 2. Potentially verify the user exists via Telegram API

      // Example with Sequelize model (assuming model exists)
      const subscriber = await db.TelegramSubscriber.create({
        username: formattedUsername,
        isActive: true,
        subscribedAt: new Date(),
      });

      return subscriber;
    } catch (error) {
      console.error('Error registering Telegram subscriber:', error.message);
      throw error;
    }
  }

  /**
   * Set up webhook for receiving updates from Telegram
   * @param {string} webhookUrl - URL for Telegram to send updates to
   * @returns {Promise<Object>} - Telegram API response
   */
  static async setWebhook(webhookUrl) {
    try {
      const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
        url: webhookUrl,
      });
      return response.data;
    } catch (error) {
      console.error('Error setting Telegram webhook:', error.message);
      throw error;
    }
  }

  /**
   * Handle incoming webhook updates from Telegram
   * @param {Object} update - Update object from Telegram
   * @returns {Promise<Object>} - Response object
   */
  static async handleWebhookUpdate(update) {
    // Extract the message
    const message = update.message;
    if (!message) return { status: 'no_message' };

    const chatId = message.chat.id;
    const text = message.text;

    // Handle commands
    if (text && text.startsWith('/')) {
      const command = text.split(' ')[0].substring(1);

      switch (command) {
        case 'start':
          await this.sendMessage(
            chatId,
            'Welcome to AdiLibs! 📚\n\nTo subscribe to our newsletter, use the /subscribe command.'
          );
          return { status: 'command_handled', command };

        case 'subscribe':
          // In a real implementation, you would save this user to your subscribers database
          await this.sendMessage(
            chatId,
            'Thanks for subscribing to AdiLibs newsletter! You will now receive updates about new books and recommendations.'
          );
          return { status: 'subscribed', chatId };

        case 'unsubscribe':
          // In a real implementation, you would remove this user from your subscribers database
          await this.sendMessage(
            chatId,
            "You have been unsubscribed from AdiLibs newsletter. We're sorry to see you go!"
          );
          return { status: 'unsubscribed', chatId };

        case 'help':
          await this.sendMessage(
            chatId,
            'AdiLibs Bot commands:\n\n' +
              '/subscribe - Subscribe to newsletter\n' +
              '/unsubscribe - Unsubscribe from newsletter\n' +
              '/recommendations - Get book recommendations\n' +
              '/help - Show this help message'
          );
          return { status: 'command_handled', command };

        case 'recommendations':
          await this.sendMessage(
            chatId,
            "📚 <b>Today's Book Recommendations</b> 📚\n\n" +
              '1. <b>The Hobbit</b> by J.R.R. Tolkien\n' +
              '2. <b>Pride and Prejudice</b> by Jane Austen\n' +
              '3. <b>1984</b> by George Orwell\n\n' +
              'Visit our website for more recommendations!'
          );
          return { status: 'command_handled', command };

        default:
          await this.sendMessage(
            chatId,
            'Unknown command. Type /help to see available commands.'
          );
          return { status: 'unknown_command', command };
      }
    }

    // Handle regular messages
    await this.sendMessage(
      chatId,
      'Thanks for your message! Use /help to see available commands.'
    );
    return { status: 'message_handled' };
  }
}

module.exports = TelegramService;
