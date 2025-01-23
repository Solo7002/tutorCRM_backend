'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TestQuestions', {
      TestQuestionId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      TestQuestionHeader: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      TestQuestionDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ImagePath: {
        type: Sequelize.STRING(255),
      },
      AudioPath: {
        type: Sequelize.STRING(255),
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
    await queryInterface.dropTable('TestQuestions');
  },
};