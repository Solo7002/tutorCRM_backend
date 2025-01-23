'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tests', {
      TestId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      TestName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      TestDescription: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      TimeLimit: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      CreatedDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tests');
  },
};