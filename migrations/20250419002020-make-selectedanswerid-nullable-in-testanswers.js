'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('TestAnswers', 'SelectedAnswerId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('TestAnswers', 'SelectedAnswerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};