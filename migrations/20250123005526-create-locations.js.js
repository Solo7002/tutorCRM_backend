'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Locations', {
      LocationId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      City: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Country: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Latitude: {
        type: Sequelize.DECIMAL(9, 6),
      },
      Longitude: {
        type: Sequelize.DECIMAL(9, 6),
      },
      Address: {
        type: Sequelize.STRING(100),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Locations');
  },
};