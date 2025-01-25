module.exports = (sequelize, DataTypes) => {
    const SaleMaterial = sequelize.define('SaleMaterial', {
      SaleMaterialId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MaterialsHeader: {
        type: DataTypes.STRING,
        allowNull: false
      },
      MaterialsDescription: {
        type: DataTypes.STRING,
        allowNull: false
      },
      CreatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      PreviewImagePath: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    SaleMaterial.associate = (models) => {
      SaleMaterial.belongsTo(models.Teacher, {
        foreignKey: 'VendorldId',
        as: 'Vendor'
      });
    };
  
    return SaleMaterial;
  };  