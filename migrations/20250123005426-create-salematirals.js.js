'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SaleMaterials', {
      SaleMaterialId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MaterialsHeader: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      MaterialsDescription: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      CreatedDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      PreviewImagePath: {
        type: Sequelize.STRING(255),
      },
      Price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      VendorldId: {
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
    await queryInterface.dropTable('SaleMaterials');
  },
};