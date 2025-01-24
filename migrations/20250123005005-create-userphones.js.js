'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserPhones', {
      UserPhoneId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      PhoneNumber: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      NickName: {
        type: Sequelize.STRING(100),
      },
      SocialNetworkName: {
        type: Sequelize.STRING(100),
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
    await queryInterface.dropTable('UserPhones');
  },
};