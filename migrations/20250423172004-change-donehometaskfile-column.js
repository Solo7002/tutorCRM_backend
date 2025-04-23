'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('DoneHomeTaskFiles', 'FilePath', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.changeColumn('DoneHomeTaskFiles', 'FileName', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('DoneHomeTaskFiles', 'FilePath', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.changeColumn('DoneHomeTaskFiles', 'FileName', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};