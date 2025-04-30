// models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config =
  require('../config/dbConfig')[process.env.NODE_ENV || 'development'];

const db = {};

// Configure Sequelize with PostgreSQL best practices
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    define: {
      // Force table names to lowercase in PostgreSQL
      freezeTableName: false,
      // Use underscores instead of camelCase for auto-generated fields
      underscored: true,
      // Ensure timestamps are used
      timestamps: true,
      // Use snake_case for timestamp column names
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    // Add logging in development mode
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
  }
);

// Read all model files and import them
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
