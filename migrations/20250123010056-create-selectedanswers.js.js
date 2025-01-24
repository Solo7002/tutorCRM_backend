'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SelectedAnswers', {
      SelectedAnswerId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      TestQuestionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TestQuestions',
          key: 'TestQuestionId',
        },
        onDelete: 'CASCADE',
      },
      DoneTestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DoneTests',
          key: 'DoneTestId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SelectedAnswers');
  },
};