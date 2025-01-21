module.exports = (sequelize, DataTypes) => {
    const SaleMaterial = sequelize.define('SaleMaterial', {
      materialsHeader: {
        type: DataTypes.STRING,
        allowNull: false
      },
      materialsDescription: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      previewImagePath: {
        type: DataTypes.STRING,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {});
  
    SaleMaterial.associate = (models) => {
      SaleMaterial.belongsTo(models.teacher, {
        foreignKey: 'vendorldId',
        as: 'vendor'
      });
    };
  
    return SaleMaterial;
  };  