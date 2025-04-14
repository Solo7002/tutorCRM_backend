'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Изменяем TestQuestionHeader: тип на TEXT и allowNull на true
    await queryInterface.changeColumn('TestQuestions', 'TestQuestionHeader', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Изменяем TestQuestionDescription: устанавливаем allowNull на true (тип уже TEXT)
    await queryInterface.changeColumn('TestQuestions', 'TestQuestionDescription', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Возвращаем TestQuestionHeader к STRING(100) и allowNull: false
    await queryInterface.changeColumn('TestQuestions', 'TestQuestionHeader', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });

    // Возвращаем TestQuestionDescription к allowNull: false (тип остается TEXT)
    await queryInterface.changeColumn('TestQuestions', 'TestQuestionDescription', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
