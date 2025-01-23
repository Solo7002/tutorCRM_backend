'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DoneHomeTaskFiles', {
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
      DoneHomeTaskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DoneHomeTasks',
          key: 'DoneHomeTaskId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DoneHomeTaskFiles');
  },
};