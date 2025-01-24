module.exports = (sequelize, DataTypes) => {
    const SaleMaterialFile = sequelize.define('SaleMaterialFile', {
      saleMaterialFileId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      appearedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
    });
  
    SaleMaterialFile.associate = (models) => {
      SaleMaterialFile.belongsTo(models.SaleMaterial, {
        foreignKey: 'saleMaterialId',
        as: 'saleMaterial'
      });
      SaleMaterialFile.belongsTo(models.PurchasedMaterial, {
        foreignKey: 'purchasedMaterialId',
        as: 'purchasedMaterial'
      });
    };
  
    return SaleMaterialFile;
  };  