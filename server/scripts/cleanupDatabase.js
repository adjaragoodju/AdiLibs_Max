// scripts/improvedCleanup.js
const { sequelize } = require('../models');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function improvedCleanup() {
  try {
    console.log('Starting improved database cleanup...');

    // First try to connect
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Get list of all tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log('Current tables in database:');
    tables.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });

    // First approach: Look for variations of the same table name
    // For example: user, User, users, Users
    const tableMap = {};
    tables.forEach((row) => {
      const tableName = row.table_name.toLowerCase();
      // Remove trailing 's' to group singular and plural forms
      const baseTableName = tableName.endsWith('s')
        ? tableName.slice(0, -1)
        : tableName;

      if (!tableMap[baseTableName]) {
        tableMap[baseTableName] = [];
      }
      tableMap[baseTableName].push(row.table_name);
    });

    // Find table groups with multiple variations
    const duplicateGroups = Object.entries(tableMap).filter(
      ([_, tableNames]) => tableNames.length > 1
    );

    if (duplicateGroups.length === 0) {
      console.log(
        '\nNo duplicate table groups found using base name matching.'
      );
    } else {
      console.log('\nFound these duplicate table groups:');
      duplicateGroups.forEach(([baseName, tableNames]) => {
        console.log(`- Base: "${baseName}": ${tableNames.join(', ')}`);
      });
    }

    // Second approach: Directly target capitalized tables
    const capitalizedTables = tables
      .map((row) => row.table_name)
      .filter((tableName) => /^[A-Z]/.test(tableName));

    if (capitalizedTables.length === 0) {
      console.log('\nNo capitalized tables found.');
    } else {
      console.log('\nFound these capitalized tables:');
      capitalizedTables.forEach((tableName) => {
        console.log(`- ${tableName}`);
      });
    }

    // Combine approaches to find tables to drop
    let tablesToDrop = capitalizedTables;

    if (tablesToDrop.length === 0) {
      console.log('\nNo tables to drop. Exiting.');
      return;
    }

    console.log('\nWARNING: About to drop these tables:');
    tablesToDrop.forEach((table) => console.log(`- ${table}`));
    console.log('This operation cannot be undone.');
    console.log('Waiting 5 seconds before proceeding...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Drop tables in reverse order to handle dependencies
    for (const table of tablesToDrop.sort().reverse()) {
      console.log(`Dropping table: ${table}`);
      try {
        await sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
        console.log(`✅ Successfully dropped table: ${table}`);
      } catch (error) {
        console.error(`❌ Error dropping table ${table}:`, error.message);
      }
    }

    console.log('\nCleanup completed. Current tables:');
    const [remainingTables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    remainingTables.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });
  } catch (error) {
    console.error('Error during database cleanup:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the cleanup
improvedCleanup();
