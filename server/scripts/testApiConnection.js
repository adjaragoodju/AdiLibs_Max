// scripts/testApiConnection.js
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const PORT = process.env.PORT || 5000;
const API_URL = `http://localhost:${PORT}`;

async function testApiConnection() {
  console.log('Testing API connection...');
  console.log(`API Root URL: ${API_URL}`);

  try {
    // Test root endpoint
    console.log('\nTesting root endpoint...');
    const rootResponse = await axios.get(API_URL);
    console.log('Root response:', rootResponse.data);
    console.log('✅ Root endpoint works!');
  } catch (error) {
    console.error('❌ Root endpoint failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('The server is not running or not listening on this port.');
    }
  }

  try {
    // Test /api/test endpoint
    console.log('\nTesting /api/test endpoint...');
    const testResponse = await axios.get(`${API_URL}/api/test`);
    console.log('Test endpoint response:', testResponse.data);
    console.log('✅ Test endpoint works!');
  } catch (error) {
    console.error('❌ Test endpoint failed:', error.message);
  }

  // Try different ports if main port fails
  if (PORT !== 3001) {
    try {
      console.log('\nTrying alternative port 3001...');
      const altResponse = await axios.get('http://localhost:3001/api/test');
      console.log('Response from port 3001:', altResponse.data);
      console.log('✅ Server is actually running on port 3001!');
      console.log(
        'You should update your frontend and test scripts to use port 3001'
      );
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('Server is not running on port 3001 either.');
      } else {
        console.error('Error on port 3001:', error.message);
      }
    }
  }

  console.log('\nTroubleshooting tips:');
  console.log('1. Make sure your server is running');
  console.log('2. Check that .env has PORT set correctly');
  console.log('3. Look for CORS errors in the server logs');
  console.log('4. Check for any network/firewall issues');
}

// Run the test
testApiConnection();
