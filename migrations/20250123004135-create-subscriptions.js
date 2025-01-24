'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subscriptions', {
      SubscriptionLevelId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      SubscriptionName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      SubscriptionDescription: {
        type: Sequelize.STRING(255),
      },
      SubscriptionPrice: {
        type: Sequelize.DECIMAL(10, 2),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Subscriptions');
  },
};