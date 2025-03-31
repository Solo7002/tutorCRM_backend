'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Teachers', 'OctoCoinId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: 'OctoCoins',
        key: 'OctoCoinId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Teachers', 'OctoCoinId');
  },
};
