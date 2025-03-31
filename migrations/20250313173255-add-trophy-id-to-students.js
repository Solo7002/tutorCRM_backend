'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Students', 'TrophyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: 'Trophies',
        key: 'TrophyId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Students', 'TrophyId');
  },
};
