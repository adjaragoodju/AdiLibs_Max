// server/models/genre.js
module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Genre.associate = (models) => {
    Genre.hasMany(models.Book);
    Genre.hasMany(models.Author);
  };

  return Genre;
};
