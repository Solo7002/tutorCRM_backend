module.exports = (sequelize, DataTypes) => {
    const PurchasedMaterial = sequelize.define('PurchasedMaterial', {
      purchasedMaterialId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      purchasedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
    });
  
    PurchasedMaterial.associate = (models) => {
      PurchasedMaterial.belongsTo(models.Material, {
        foreignKey: 'saleMaterialId',
        as: 'saleMaterial'
      });
      PurchasedMaterial.belongsTo(models.Teacher, {
        foreignKey: 'purchaserId',
        as: 'purchaser'
      });
    };
  
    return PurchasedMaterial;
  };  