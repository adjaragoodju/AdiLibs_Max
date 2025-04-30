// server/utils/dbHealthCheck.js
const { sequelize, Sequelize } = require('../models');

/**
 * Performs health check on database connection and tables
 * @returns {Promise<Object>} Results of database checks
 */
async function checkDatabaseHealth() {
  const results = {
    connection: false,
    tables: {},
    errors: [],
  };

  try {
    // Test database connection
    await sequelize.authenticate();
    results.connection = true;
    console.log('Database connection established successfully.');

    // Get list of all tables in the database
    const [dbTables] = await sequelize.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );

    const tableNames = dbTables.map((t) => t.table_name);
    console.log('Database tables:', tableNames);

    // Check each model against the database
    const models = Object.keys(sequelize.models);

    for (const modelName of models) {
      const model = sequelize.models[modelName];

      try {
        // This will throw an error if the table doesn't match the model
        await model.describe();
        results.tables[modelName] = true;
      } catch (error) {
        results.tables[modelName] = false;
        results.errors.push(
          `Table check failed for model ${modelName}: ${error.message}`
        );
      }
    }

    return results;
  } catch (error) {
    console.error('Database health check failed:', error);
    results.errors.push(`Database connection error: ${error.message}`);
    return results;
  }
}

module.exports = { checkDatabaseHealth };
