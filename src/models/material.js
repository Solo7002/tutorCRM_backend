module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define('Material', {
      materialName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['file', 'folder']]
        }
      }
    }, {});
  
    Material.associate = (models) => {
      Material.belongsTo(models.material, {
        foreignKey: 'parentId',
        as: 'parent'
      });
      Material.belongsTo(models.teacher, {
        foreignKey: 'teacherId',
        as: 'teacher'
      });
    };
  
    return Material;
  };  