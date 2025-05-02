// scripts/fixDatabaseIssues.js
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function fixDatabaseIssues() {
  try {
    console.log('Starting database fix...');

    // First try to connect
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Check tables
    console.log('\nChecking database tables...');
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log('Current tables in database:');
    tables.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });

    // Check if users table exists
    const usersTable = tables.find(
      (row) => row.table_name === 'users' || row.table_name === 'Users'
    );

    if (!usersTable) {
      console.log('\n❌ Users table not found. Creating it now...');

      // Sync only the User model with force option
      await sequelize.models.User.sync({ force: true });
      console.log('✅ Users table created successfully!');
    } else {
      console.log(`\n✅ Users table found: ${usersTable.table_name}`);

      // Check if the case of the table name matches the model
      if (usersTable.table_name !== 'users') {
        console.log(
          `⚠️ Table name case mismatch: ${usersTable.table_name} vs 'users'`
        );
        console.log(
          'This might cause issues. Consider recreating the table with correct naming.'
        );
      }
    }

    // Check table columns
    if (usersTable) {
      console.log('\nChecking users table structure...');

      try {
        const tableInfo = await sequelize.models.User.describe();
        console.log('✅ Users table structure is valid.');
        console.log('Columns:', Object.keys(tableInfo));
      } catch (describeError) {
        console.error(
          '❌ Error describing users table:',
          describeError.message
        );
        console.log(
          'Consider recreating the users table to fix structural issues.'
        );
      }
    }

    // Create admin user as a test
    console.log('\nTrying to create an admin user as a test...');

    try {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Check if admin already exists
      const adminExists = await sequelize.models.User.findOne({
        where: { email: 'admin@adilibs.com' },
      });

      if (adminExists) {
        console.log('✅ Admin user already exists, no need to create');
      } else {
        const admin = await sequelize.models.User.create({
          username: 'admin',
          email: 'admin@adilibs.com',
          password: hashedPassword,
          isAdmin: true,
        });

        console.log('✅ Admin user created successfully:', {
          id: admin.id,
          username: admin.username,
          email: admin.email,
        });
      }
    } catch (userError) {
      console.error('❌ Error creating admin user:', userError.message);

      // If this fails due to column issues, suggest recreating the table
      if (userError.name === 'SequelizeDatabaseError') {
        console.log(
          'This indicates a mismatch between the model and table structure.'
        );
        console.log(
          'Consider running: await sequelize.models.User.sync({ force: true });'
        );
      }
    }

    console.log('\nDatabase fix completed.');
    console.log(
      'If issues persist, consider completely recreating the database tables with:'
    );
    console.log('node scripts/forceReset.js');
  } catch (error) {
    console.error('Error fixing database:', error);

    // Provide specific guidance based on error type
    if (error.name === 'SequelizeConnectionError') {
      console.error('\nDatabase connection error. Check your .env file:');
      console.log('DB_USER:', process.env.DB_USER);
      console.log('DB_HOST:', process.env.DB_HOST);
      console.log('DB_NAME:', process.env.DB_NAME);
      console.log(
        'Make sure PostgreSQL is running and these values are correct.'
      );
    }
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the fix
fixDatabaseIssues();
