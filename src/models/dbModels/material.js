module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define('Material', {
    MaterialId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    MaterialName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'MaterialName cannot be empty' },
        len: { args: [1, 255], msg: 'MaterialName must be between 1 and 255 characters' },
      },
    },
    Type: {
      type: DataTypes.ENUM('file', 'folder'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['file', 'folder']],
          msg: 'Type must be either "file" or "folder"',
        },
        notEmpty: { msg: 'Type cannot be empty' },
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