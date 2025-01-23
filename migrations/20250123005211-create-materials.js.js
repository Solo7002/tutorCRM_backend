'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Materials', {
      MaterialId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MaterialName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      Type: {
        type: Sequelize.ENUM('file', 'folder'),
        allowNull: false,
      },
      ParentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Materials',
          key: 'MaterialId',
        },
        onDelete: 'CASCADE',
      },
      TeacherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Teachers',
          key: 'TeacherId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Materials');
  },
};