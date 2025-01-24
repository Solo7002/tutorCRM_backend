module.exports = (sequelize, DataTypes) => {
    const SaleMaterial = sequelize.define('SaleMaterial', {
      saleMaterialId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
    }, {
      timestamps: false,
    });
  
    SaleMaterial.associate = (models) => {
      SaleMaterial.belongsTo(models.Teacher, {
        foreignKey: 'vendorldId',
        as: 'vendor'
      });
    };
  
    return SaleMaterial;
  };  