'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('SelectedAnswers', 'TestAnswerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'TestAnswers',
        key: 'TestAnswerId',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SelectedAnswers', 'TestAnswerId');
  },
};