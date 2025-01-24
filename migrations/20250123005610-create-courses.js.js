'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Courses', {
      CourseId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      CourseName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ImageFilePath: {
        type: Sequelize.STRING(255),
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
      SubjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Subjects',
          key: 'SubjectId',
        },
        onDelete: 'CASCADE',
      },
      LocationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Locations',
          key: 'LocationId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Courses');
  },
};