'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HomeTasks', {
      HomeTaskId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      HomeTaskHeader: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      HomeTaskDescription: {
        type: Sequelize.TEXT,
      },
      StartDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      DeadlineDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      MaxMark: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ImageFilePath: {
        type: Sequelize.STRING(255),
      },
      GroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'GroupId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('HomeTasks');
  },
};