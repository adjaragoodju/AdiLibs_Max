// server/models/favorite.js
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    // No additional fields needed
  }, {
    // Explicitly use lowercase table name for PostgreSQL
    tableName: 'favorites',
    // Keep timestamps but make sure they match PostgreSQL conventions
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User);
    Favorite.belongsTo(models.Book);
  };

  return Favorite;
};
