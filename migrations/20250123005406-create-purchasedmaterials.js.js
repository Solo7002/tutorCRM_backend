'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PurchasedMaterials', {
      PurchasedMaterialId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      PurchasedDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      PurchaserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Teachers',
          key: 'TeacherId',
        },
        onDelete: 'CASCADE',
      },
      SaleMaterialId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Materials',
          key: 'MaterialId',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PurchasedMaterials');
  },
};