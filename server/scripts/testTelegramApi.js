// scripts/testTelegramApi.js
const axios = require('axios');

// The Telegram username to subscribe
const telegramUsername = '@your_telegram_username'; // Replace with your actual username

// Test the subscription endpoint
async function testSubscribe() {
  try {
    console.log(`Testing subscription for username: ${telegramUsername}`);

    const response = await axios.post(
      'http://localhost:3001/api/telegram/subscribe',
      {
        username: telegramUsername,
      }
    );

    console.log('Subscription response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Subscription error:', error.response?.data || error.message);
    throw error;
  }
}

// Run the test
testSubscribe()
  .then(() => console.log('Test completed successfully'))
  .catch(() => console.log('Test failed'));
