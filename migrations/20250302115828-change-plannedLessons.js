'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // Удаляем поля LessonDate, LessonTime и TimeZone
      await queryInterface.removeColumn('PlannedLessons', 'LessonDate', { transaction: t });
      await queryInterface.removeColumn('PlannedLessons', 'LessonTime', { transaction: t });
      await queryInterface.removeColumn('PlannedLessons', 'TimeZone', { transaction: t });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // Восстанавливаем удаленные поля с их предполагаемыми типами данных
      await queryInterface.addColumn('PlannedLessons', 'LessonDate', {
        type: Sequelize.DATE,
        allowNull: false,
      }, { transaction: t });

      await queryInterface.addColumn('PlannedLessons', 'LessonTime', {
        type: Sequelize.TIME,
        allowNull: false,
      }, { transaction: t });

      await queryInterface.addColumn('PlannedLessons', 'TimeZone', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction: t });
    });
  },
};