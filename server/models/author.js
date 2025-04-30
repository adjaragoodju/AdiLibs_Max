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
  }, {
    // Explicitly use lowercase table name for PostgreSQL
    tableName: 'authors',
    // Keep timestamps but make sure they match PostgreSQL conventions
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Author.associate = (models) => {
    Author.hasMany(models.Book);
    Author.belongsTo(models.Genre);
  };

  return Author;
};
