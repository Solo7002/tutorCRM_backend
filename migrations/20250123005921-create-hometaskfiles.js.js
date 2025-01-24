'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HomeTaskFiles', {
      HomeTaskFileId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      FilePath: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      FileName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      HomeTaskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'HomeTasks',
          key: 'HomeTaskId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('HomeTaskFiles');
  },
};