'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OctoCoins', {
      OctoCoinId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      TeacherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Teachers',
          key: 'TeacherId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      Amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('OctoCoins');
  },
};
