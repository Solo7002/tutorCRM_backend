'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PlannedLessons', {
      PlannedLessonId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      LessonHeader: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      LessonDescription: {
        type: Sequelize.TEXT,
      },
      LessonPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      IsPaid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      GroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'GroupId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PlannedLessons');
  },
};