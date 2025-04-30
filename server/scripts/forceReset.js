// scripts/forceReset.js
const { sequelize } = require('../models');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

async function forceReset() {
  try {
    console.log('Starting complete database reset...');

    // First try to connect
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log(
      '\nWARNING: This will DELETE ALL TABLES and DATA in your database!'
    );
    console.log('You will lose all your data. This cannot be undone.');
    console.log('Waiting 5 seconds before proceeding...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // First drop all existing tables to start fresh
    console.log('Getting all tables...');
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log('Current tables to drop:');
    tables.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });

    // Drop each table with CASCADE option
    for (const row of tables) {
      const tableName = row.table_name;
      console.log(`Dropping table: ${tableName}`);
      try {
        await sequelize.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
      } catch (error) {
        console.error(`Error dropping ${tableName}:`, error.message);
      }
    }

    console.log('All tables dropped successfully.');

    // Now create tables from scratch with our models
    console.log('Creating tables from models...');
    await sequelize.sync({ force: true });
    console.log('Tables created successfully!');

    // Seed with sample data
    console.log('Seeding database with initial data...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await sequelize.models.User.create({
      username: 'admin',
      email: 'admin@adilibs.com',
      password: hashedPassword,
      isAdmin: true,
    });
    console.log('Admin user created:', admin.username);

    // Create sample genres
    const genres = await Promise.all([
      sequelize.models.Genre.create({ name: 'Fiction' }),
      sequelize.models.Genre.create({ name: 'Non-Fiction' }),
      sequelize.models.Genre.create({ name: 'Science Fiction' }),
      sequelize.models.Genre.create({ name: 'Mystery' }),
    ]);
    console.log('Sample genres created');

    // Create sample authors
    const authors = await Promise.all([
      sequelize.models.Author.create({
        name: 'J.K. Rowling',
        description: 'British author best known for the Harry Potter series.',
        GenreId: genres[0].id,
      }),
      sequelize.models.Author.create({
        name: 'George Orwell',
        description: 'English novelist and essayist.',
        GenreId: genres[0].id,
      }),
      sequelize.models.Author.create({
        name: 'Isaac Asimov',
        description: 'American writer and professor of biochemistry.',
        GenreId: genres[2].id,
      }),
    ]);
    console.log('Sample authors created');

    // Create sample books
    await Promise.all([
      sequelize.models.Book.create({
        title: "Harry Potter and the Philosopher's Stone",
        year: '1997',
        description: 'The first novel in the Harry Potter series.',
        image: '/placeholder-book.jpg',
        pages: 223,
        AuthorId: authors[0].id,
        GenreId: genres[0].id,
      }),
      sequelize.models.Book.create({
        title: '1984',
        year: '1949',
        description: 'A dystopian social science fiction novel.',
        image: '/placeholder-book.jpg',
        pages: 328,
        AuthorId: authors[1].id,
        GenreId: genres[0].id,
      }),
      sequelize.models.Book.create({
        title: 'Foundation',
        year: '1951',
        description: "The first novel in Asimov's Foundation series.",
        image: '/placeholder-book.jpg',
        pages: 255,
        AuthorId: authors[2].id,
        GenreId: genres[2].id,
      }),
    ]);
    console.log('Sample books created');

    // Verify database state
    console.log('\nVerifying database state...');
    const [finalTables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log('Current tables in database:');
    finalTables.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });

    console.log('\nDatabase reset and seeded successfully!');
  } catch (error) {
    console.error('Error during database reset:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the reset
forceReset();
