// scripts/testRegistration.js
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configuration
const PORT = process.env.PORT || 3001;
const API_URL = `http://localhost:${PORT}/api`;

// Test user data - change this for each test
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
};

async function testRegistration() {
  console.log(`Testing registration API at ${API_URL}/auth/register`);
  console.log('Test user:', {
    username: testUser.username,
    email: testUser.email,
    password: '***', // Don't log actual password
  });

  try {
    // Test server connection first
    try {
      console.log('\nTesting API connection...');
      const testResponse = await axios.get(`${API_URL}/test`);
      console.log('✅ API connection working:', testResponse.data);
    } catch (connError) {
      console.error('❌ API connection failed:', connError.message);
      console.log(`Make sure your server is running on port ${PORT}`);
      return;
    }

    // Try registration
    console.log('\nAttempting registration...');
    const response = await axios.post(`${API_URL}/auth/register`, testUser, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Registration successful!');
    console.log('Response:', {
      status: response.status,
      data: response.data,
    });

    // Try login with the same credentials
    console.log('\nTesting login with registered credentials...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });

    console.log('✅ Login successful!');
    console.log('Login response:', {
      status: loginResponse.status,
      user: loginResponse.data.user,
      token: loginResponse.data.token ? 'Token received' : 'No token',
    });

    return true;
  } catch (error) {
    console.error('❌ Test failed:');

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server response:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Server might be down.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }

    console.log('\nTroubleshooting tips:');
    console.log('1. Check if server is running');
    console.log('2. Verify the server port matches the API_URL');
    console.log('3. Check database connection');
    console.log('4. Look at server logs for additional errors');
    console.log('5. Make sure CORS is configured correctly');

    return false;
  }
}

// Run the test
testRegistration();
