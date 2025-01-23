'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TestAnswers', {
      TestAnswerId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      AnswerText: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      ImagePath: {
        type: Sequelize.STRING(255),
      },
      IsRightAnswer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TestAnswers');
  },
};