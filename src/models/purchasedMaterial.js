module.exports = (sequelize, DataTypes) => {
    const PurchasedMaterial = sequelize.define('PurchasedMaterial', {
      purchasedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {});
  
    PurchasedMaterial.associate = (models) => {
      PurchasedMaterial.belongsTo(models.material, {
        foreignKey: 'saleMaterialId',
        as: 'saleMaterial'
      });
      PurchasedMaterial.belongsTo(models.teacher, {
        foreignKey: 'purchaserId',
        as: 'purchaser'
      });
    };
  
    return PurchasedMaterial;
  };  