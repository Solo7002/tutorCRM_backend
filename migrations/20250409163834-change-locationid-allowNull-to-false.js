'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Courses', 'LocationId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Locations',
        key: 'LocationId',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Courses', 'LocationId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Locations',
        key: 'LocationId',
      },
      onDelete: 'CASCADE',
    });
  },
};