module.exports = (sequelize, DataTypes) => {
    const PurchasedMaterial = sequelize.define('PurchasedMaterial', {
      PurchasedMaterialId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      PurchasedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
    });
  
    PurchasedMaterial.associate = (models) => {
      PurchasedMaterial.belongsTo(models.Material, {
        foreignKey: 'SaleMaterialId',
        as: 'SaleMaterial'
      });
      PurchasedMaterial.belongsTo(models.Teacher, {
        foreignKey: 'PurchaserId',
        as: 'Purchaser'
      });
    };
  
    return PurchasedMaterial;
  };  