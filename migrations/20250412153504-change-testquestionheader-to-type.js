'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('TestQuestions', {TestQuestionHeader: {
      type: Sequelize.STRING(1500),
      allowNull: false,
    }});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('TestQuestions', 'TestQuestionHeader', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
  },
};

