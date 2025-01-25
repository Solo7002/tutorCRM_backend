module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define('Material', {
      MaterialId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      MaterialName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['file', 'folder']]
        }
      }
    }, {
      timestamps: false,
    });
  
    Material.associate = (models) => {
      Material.belongsTo(models.Material, {
        foreignKey: 'ParentId',
        as: 'Parent'
      });
      Material.belongsTo(models.Teacher, {
        foreignKey: 'TeacherId',
        as: 'Teacher'
      });
    };
  
    return Material;
  };  