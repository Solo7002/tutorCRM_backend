module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define('Material', {
      materialId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
    }, {
      timestamps: false,
    });
  
    Material.associate = (models) => {
      Material.belongsTo(models.Material, {
        foreignKey: 'parentId',
        as: 'parent'
      });
      Material.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
        as: 'teacher'
      });
    };
  
    return Material;
  };  