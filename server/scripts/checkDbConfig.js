// scripts/checkDbConfig.js
const { sequelize } = require('../models');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function checkDatabaseConfig() {
  console.log('Checking database configuration...');
  console.log('Environment variables:');
  console.log('- DB_USER:', process.env.DB_USER);
  console.log('- DB_HOST:', process.env.DB_HOST);
  console.log('- DB_NAME:', process.env.DB_NAME);
  console.log('- PORT:', process.env.PORT);

  try {
    console.log('\nTesting database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');

    // Try to query users table to check if admin exists
    console.log('\nChecking for admin user...');
    const [users] = await sequelize.query(
      `SELECT * FROM users WHERE email = 'admin@adilibs.com'`
    );

    if (users.length > 0) {
      console.log('✅ Admin user found:', {
        id: users[0].id,
        username: users[0].username,
        email: users[0].email,
        isAdmin: users[0].isAdmin,
      });
    } else {
      console.log('❌ Admin user not found in database.');
      console.log('You may need to reseed your database.');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log(
      '2. Check that database name, user and password are correct in .env'
    );
    console.log('3. Verify that the database exists');
  } finally {
    try {
      await sequelize.close();
    } catch (e) {
      // Ignore close errors
    }
  }
}

// Run the check
checkDatabaseConfig();
