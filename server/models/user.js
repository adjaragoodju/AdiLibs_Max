module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profileImage: {
        type: DataTypes.STRING,
        defaultValue: '/placeholder-avatar.jpg.avif',
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      // Explicitly use lowercase table name for PostgreSQL
      tableName: 'users',
      // Use underscores for column names (PostgreSQL convention)
      underscored: true,
      // Keep timestamps
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Favorite);
  };

  return User;
};
