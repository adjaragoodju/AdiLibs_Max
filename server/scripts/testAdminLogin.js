// scripts/testAdminLogin.js
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const API_URL = `http://localhost:${process.env.PORT || 5000}/api`;
const ADMIN_CREDENTIALS = {
  email: 'admin@adilibs.com',
  password: 'admin123',
};

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    console.log(`API URL: ${API_URL}/auth/login`);
    console.log('Credentials:', {
      email: ADMIN_CREDENTIALS.email,
      password: '******',
    });

    // Test API connection first
    try {
      const healthResponse = await axios.get(`${API_URL}/health`);
      console.log('API health check:', healthResponse.data);
    } catch (healthError) {
      console.error('API health check failed:', healthError.message);
      console.log(
        'This suggests the server might not be running or might be on a different port.'
      );
    }

    // Try the login
    const response = await axios.post(
      `${API_URL}/auth/login`,
      ADMIN_CREDENTIALS
    );

    console.log('Login successful!');
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    console.log('User:', {
      id: response.data.user.id,
      username: response.data.user.username,
      email: response.data.user.email,
      isAdmin: response.data.user.isAdmin,
    });

    return true;
  } catch (error) {
    console.error('Login test failed:');

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server response:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error(
        'No response received. Server might be down or on a different port.'
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }

    console.log('\nTroubleshooting tips:');
    console.log('1. Check if server is running');
    console.log('2. Verify the server port matches frontend expectations');
    console.log('3. Check CORS configuration');
    console.log('4. Verify admin user exists in database');
    console.log('5. Check server logs for additional errors');

    return false;
  }
}

// Run the test
testAdminLogin();
