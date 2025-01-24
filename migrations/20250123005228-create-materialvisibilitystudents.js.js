'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MaterialVisibilityStudents', {
      MaterialId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Materials',
          key: 'MaterialId',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      StudentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'UserId',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MaterialVisibilityStudents');
  },
};