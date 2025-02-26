'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('MarkHistory', 'MarkType', {
      type: Sequelize.ENUM('test', 'homework', 'classwork'),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('MarkHistory', 'MarkType', {
      type: Sequelize.ENUM('test', 'homework'),
      allowNull: false,
    });
  },
};