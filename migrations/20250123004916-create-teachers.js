'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Teachers', {
      TeacherId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      AboutTeacher: {
        type: Sequelize.STRING(255),
      },
      LessonPrice: {
        type: Sequelize.INTEGER,
      },
      LessonType: {
        type: Sequelize.ENUM('group', 'solo'),
        allowNull: false,
      },
      MeetingType: {
        type: Sequelize.ENUM('offline', 'online'),
        allowNull: false,
      },
      SubscriptionLevelId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Subscriptions',
          key: 'SubscriptionLevelId',
        },
        onDelete: 'SET NULL',
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'UserId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Teachers');
  },
};