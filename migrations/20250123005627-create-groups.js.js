'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Groups', {
      GroupId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      GroupName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      GroupPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      ImageFilePath: {
        type: Sequelize.STRING(255),
      },
      CourseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Courses',
          key: 'CourseId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Groups');
  },
};