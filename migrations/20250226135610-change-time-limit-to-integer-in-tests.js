'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Tests', 'TimeLimit', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Tests', 'TimeLimit', {
      type: Sequelize.TIME,
      allowNull: false,
    });
  },
};