module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    GroupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    GroupName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Group name cannot be empty', },
        len: { args: [3, 255], msg: 'Group name must be between 3 and 255 characters long', },
      },
    },
    GroupPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'Group price must be a valid decimal number', },
        min: { args: [0], msg: 'Group price must be at least 0', },
      },
    },
    ImageFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'Image file path must be a valid URL', },
      },
    }
  }, {
    timestamps: false,
  });

  Group.associate = (models) => {
    Group.hasMany(models.GroupStudent, {
      foreignKey: 'GroupId',
      as: 'Students'
    });
  };

  return Group;
};  