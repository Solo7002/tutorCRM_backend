'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Teachers', 'AboutTeacher', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('Teachers', 'LessonPrice', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('Teachers', 'LessonType', {
      type: Sequelize.ENUM('group', 'solo'),
      allowNull: true,
    });

    await queryInterface.changeColumn('Teachers', 'MeetingType', {
      type: Sequelize.ENUM('offline', 'online'),
      allowNull: true,
    });

    await queryInterface.changeColumn('Teachers', 'SubscriptionLevelId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Subscriptions',
        key: 'SubscriptionLevelId',
      },
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Teachers', 'AboutTeacher', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('Teachers', 'LessonPrice', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('Teachers', 'LessonType', {
      type: Sequelize.ENUM('group', 'solo'),
      allowNull: false,
    });

    await queryInterface.changeColumn('Teachers', 'MeetingType', {
      type: Sequelize.ENUM('offline', 'online'),
      allowNull: false,
    });

    await queryInterface.changeColumn('Teachers', 'SubscriptionLevelId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Subscriptions',
        key: 'SubscriptionLevelId',
      },
      onDelete: 'SET NULL',
    });
  },
};