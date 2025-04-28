// server/models/favorite.js
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    // No additional fields needed
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User);
    Favorite.belongsTo(models.Book);
  };

  return Favorite;
};
