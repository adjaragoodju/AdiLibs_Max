// models/telegramSubscriber.js
module.exports = (sequelize, DataTypes) => {
  const TelegramSubscriber = sequelize.define(
    'TelegramSubscriber',
    {
      // Telegram user info
      username: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null because not all users have usernames
        unique: true, // Unique when present
      },
      chatId: {
        type: DataTypes.STRING,
        allowNull: true, // Can be null initially if registering by username
        unique: true, // Each chat ID is unique
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // Subscription status
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      subscribedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      unsubscribedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // Preferences
      receivePromotions: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      receiveNewReleases: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      preferredGenres: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const value = this.getDataValue('preferredGenres');
          return value ? value.split(',') : [];
        },
        set(val) {
          this.setDataValue(
            'preferredGenres',
            Array.isArray(val) ? val.join(',') : val
          );
        },
      },
      // Tracking fields
      lastMessageSentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      totalMessagesSent: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lastInteractionAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      // Explicitly use lowercase table name for PostgreSQL
      tableName: 'telegram_subscribers',
      // Keep timestamps but make sure they match PostgreSQL conventions
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  TelegramSubscriber.associate = (models) => {
    // You can add associations here if needed
    // For example, if you want to associate with User:
    // TelegramSubscriber.belongsTo(models.User);
  };

  return TelegramSubscriber;
};
