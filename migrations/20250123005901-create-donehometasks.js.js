'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DoneHomeTasks', {
      DoneHomeTaskId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Mark: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      DoneDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      HomeTaskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'HomeTasks',
          key: 'HomeTaskId',
        },
        onDelete: 'CASCADE',
      },
      StudentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Students',
          key: 'StudentId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DoneHomeTasks');
  },
};