'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // Добавляем поле LessonDate с типом DATETIME
      await queryInterface.addColumn(
        'PlannedLessons', // Имя таблицы
        'LessonDate',     // Имя нового поля
        {
          type: Sequelize.DATE, // Тип данных DATETIME в Sequelize
          allowNull: false,     // Поле обязательное (можно изменить на true, если null допустим)
          defaultValue: Sequelize.fn('NOW'), // Значение по умолчанию (текущая дата и время)
        },
        { transaction: t }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // Удаляем поле LessonDate в случае отката миграции
      await queryInterface.removeColumn('PlannedLessons', 'LessonDate', { transaction: t });
    });
  },
};