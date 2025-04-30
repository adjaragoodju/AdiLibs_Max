// scripts/setupDatabase.js
const { sequelize } = require('../models');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // First try to connect
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if we should force recreate the tables (DANGER: loses all data)
    const forceReset = process.argv.includes('--force');

    if (forceReset) {
      console.log('WARNING: --force flag detected. All data will be lost!');
      console.log('Waiting 5 seconds before proceeding...');

      // Simple delay to give admin a chance to cancel
      await new Promise((resolve) => setTimeout(resolve, 5000));

      console.log('Dropping and recreating all tables...');
      await sequelize.sync({ force: true });
      console.log('All tables have been recreated.');
    } else {
      // Safer option - alter tables to match models
      console.log('Syncing database tables with models (alter: true)...');
      await sequelize.sync({ alter: true });
      console.log('Database tables have been updated to match models.');
    }

    // Get list of tables for verification
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log('Current tables in database:');
    results.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });

    console.log('Database setup completed successfully!');

    // List models for reference
    console.log('\nSequelize models available:');
    Object.keys(sequelize.models).forEach((modelName) => {
      const model = sequelize.models[modelName];
      console.log(
        `- ${modelName} -> ${model.tableName || modelName.toLowerCase() + 's'}`
      );
    });
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the setup
setupDatabase();
