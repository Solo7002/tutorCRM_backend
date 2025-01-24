'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BlockedUsers', {
      BlockedId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ReasonDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      BanStartDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      BanEndDate: {
        type: Sequelize.DATE,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'UserId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BlockedUsers');
  },
};