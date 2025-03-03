'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PlannedLessons', 'LessonDate', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    });

    await queryInterface.addColumn('PlannedLessons', 'LessonTime', {
      type: Sequelize.STRING(20), // Время в формате 'HH:MM - HH:MM'
      allowNull: false,
    });

    await queryInterface.addColumn('PlannedLessons', 'TimeZone', {
      type: Sequelize.STRING(50),
      defaultValue: 'UTC',
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PlannedLessons', 'LessonDate');

    await queryInterface.removeColumn('PlannedLessons', 'LessonTime');

    await queryInterface.removeColumn('PlannedLessons', 'TimeZone');
  },
};