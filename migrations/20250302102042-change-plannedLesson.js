'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // Удаляем существующие поля
      await queryInterface.removeColumn('PlannedLessons', 'IsPaid', { transaction: t });
      await queryInterface.removeColumn('PlannedLessons', 'LessonDescription', { transaction: t });
      await queryInterface.removeColumn('PlannedLessons', 'LessonPrice', { transaction: t });

      // Добавляем новые поля
      await queryInterface.addColumn('PlannedLessons', 'StartLessonTime', {
        type: Sequelize.DATE,
        allowNull: false,
      }, { transaction: t });

      await queryInterface.addColumn('PlannedLessons', 'EndLessonTime', {
        type: Sequelize.DATE,
        allowNull: false,
      }, { transaction: t });

      await queryInterface.addColumn('PlannedLessons', 'LessonType', {
        type: Sequelize.ENUM('online', 'offline'),
        allowNull: false,
      }, { transaction: t });

      await queryInterface.addColumn('PlannedLessons', 'LessonAddress', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction: t });

      await queryInterface.addColumn('PlannedLessons', 'LessonLink', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction: t });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // Удаляем добавленные поля
      await queryInterface.removeColumn('PlannedLessons', 'StartLessonTime', { transaction: t });
      await queryInterface.removeColumn('PlannedLessons', 'EndLessonTime', { transaction: t });
      await queryInterface.removeColumn('PlannedLessons', 'LessonType', { transaction: t });
      await queryInterface.removeColumn('PlannedLessons', 'LessonAddress', { transaction: t });
      await queryInterface.removeColumn('PlannedLessons', 'LessonLink', { transaction: t });

      // Восстанавливаем удаленные поля
      await queryInterface.addColumn('PlannedLessons', 'IsPaid', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }, { transaction: t });

      await queryInterface.addColumn('PlannedLessons', 'LessonDescription', {
        type: Sequelize.TEXT,
      }, { transaction: t });

      await queryInterface.addColumn('PlannedLessons', 'LessonPrice', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      }, { transaction: t });
    });
    
    // Удаляем ENUM тип после отката
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_PlannedLessons_LessonType";');
  },
};