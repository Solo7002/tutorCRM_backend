'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SaleMaterialFiles', {
      SaleMaterialFileId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      FilePath: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      FileName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      AppearedDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      SaleMaterialId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SaleMaterials',
          key: 'SaleMaterialId',
        },
        onDelete: 'CASCADE',
      },
      PurchasedMaterialId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PurchasedMaterials',
          key: 'PurchasedMaterialId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SaleMaterialFiles');
  },
};