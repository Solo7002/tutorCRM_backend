module.exports = (sequelize, DataTypes) => {
  const PurchasedMaterial = sequelize.define('PurchasedMaterial', {
    PurchasedMaterialId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    PurchasedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'PurchasedDate must be a valid date' },
      },
    }
  }, {
    timestamps: false,
  });
  
  return PurchasedMaterial;
};  