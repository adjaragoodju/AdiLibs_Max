// server/models/genre.js
module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    // Explicitly use lowercase table name for PostgreSQL
    tableName: 'genres',
    // Keep timestamps but make sure they match PostgreSQL conventions
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Genre.associate = (models) => {
    Genre.hasMany(models.Book);
    Genre.hasMany(models.Author);
  };

  return Genre;
};
