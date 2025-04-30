// server/models/book.js
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    'Book',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: '/placeholder-book.jpg',
      },
      pages: {
        type: DataTypes.INTEGER,
        defaultValue: 320,
      },
      language: {
        type: DataTypes.STRING,
        defaultValue: 'English',
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 4.0,
        validate: {
          min: 0,
          max: 5,
        },
      },
      ratingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      // Explicitly use lowercase table name for PostgreSQL
      tableName: 'books',
      // Keep timestamps but make sure they match PostgreSQL conventions
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Book.associate = (models) => {
    Book.belongsTo(models.Author);
    Book.belongsTo(models.Genre);
    Book.hasMany(models.Favorite);
  };

  return Book;
};
