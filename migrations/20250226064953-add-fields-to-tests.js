'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tests', 'DeadlineDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Tests', 'AttemptsTotal', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addColumn('Tests', 'ShowAnswers', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tests', 'DeadlineDate');
    await queryInterface.removeColumn('Tests', 'AttemptsTotal');
    await queryInterface.removeColumn('Tests', 'ShowAnswers');
  },
};