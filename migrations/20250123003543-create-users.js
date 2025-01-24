'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      UserId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      Password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      LastName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      FirstName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      ImageFilePath: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      CreateDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};