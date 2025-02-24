'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Materials', 'FilePath', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('Materials', 'FileImage', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('Materials', 'AppearanceDate', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Materials', 'FilePath');
    await queryInterface.removeColumn('Materials', 'FileImage');
    await queryInterface.removeColumn('Materials', 'AppearanceDate');
  },
};