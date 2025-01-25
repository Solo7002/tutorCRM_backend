module.exports = (sequelize, DataTypes) => {
    const SaleMaterialFile = sequelize.define('SaleMaterialFile', {
      SaleMaterialFileId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      FilePath: {
        type: DataTypes.STRING,
        allowNull: false
      },
      FileName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      AppearedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
    });
  
    SaleMaterialFile.associate = (models) => {
      SaleMaterialFile.belongsTo(models.SaleMaterial, {
        foreignKey: 'SaleMaterialId',
        as: 'SaleMaterial'
      });
      SaleMaterialFile.belongsTo(models.PurchasedMaterial, {
        foreignKey: 'PurchasedMaterialId',
        as: 'PurchasedMaterial'
      });
    };
  
    return SaleMaterialFile;
  };  