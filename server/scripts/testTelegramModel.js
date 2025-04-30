// scripts/testTelegramModel.js
const { sequelize, TelegramSubscriber } = require('../models');

async function testTelegramModel() {
  try {
    console.log('Testing database connection...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Check if TelegramSubscriber model is properly defined
    if (!TelegramSubscriber) {
      console.error('❌ TelegramSubscriber model is not defined in models');
      return;
    }

    // Test the model by querying all subscribers
    console.log('Testing TelegramSubscriber model...');
    const subscribers = await TelegramSubscriber.findAll();
    console.log(`Found ${subscribers.length} subscribers in database`);

    // Create a test subscriber
    console.log('Creating a test subscriber...');
    const testUsername = `test_user_${Date.now()}`;
    const testSubscriber = await TelegramSubscriber.create({
      username: testUsername,
      isActive: true,
      subscribedAt: new Date(),
    });

    console.log(
      '✅ Test subscriber created successfully:',
      testSubscriber.toJSON()
    );

    // Delete the test subscriber
    await testSubscriber.destroy();
    console.log('✅ Test subscriber deleted successfully');

    console.log('All database tests passed!');
  } catch (error) {
    console.error('❌ Database test failed:', error);

    // Helpful error diagnosis
    if (error.name === 'SequelizeConnectionError') {
      console.error(
        'Database connection error. Check your .env file and database credentials.'
      );
    } else if (error.name === 'SequelizeConnectionRefusedError') {
      console.error(
        'Database connection refused. Make sure your database server is running.'
      );
    } else if (error.name === 'SequelizeDatabaseError') {
      console.error('Database error. Check your database schema.');
    } else if (error.name === 'SequelizeValidationError') {
      console.error('Validation error. Check your model definitions.');
    }
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed');
  }
}

// Run the test
testTelegramModel();
