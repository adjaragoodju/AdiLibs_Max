// server/models/author.js
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: '/writer.jpg',
    },
  });

  Author.associate = (models) => {
    Author.hasMany(models.Book);
    Author.belongsTo(models.Genre);
  };

  return Author;
};
