'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DoneTests', {
      DoneTestId: {
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
      SpentTime: {
        type: Sequelize.TIME,
        allowNull: false,
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
      TestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tests',
          key: 'TestId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DoneTests');
  },
};