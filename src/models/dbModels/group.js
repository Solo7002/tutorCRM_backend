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
        notEmpty: { msg: 'Group name cannot be empty' },
        len: { args: [3, 255], msg: 'Group name must be between 3 and 255 characters long' },
      },
    },
    GroupPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: { msg: 'Group price must be a valid decimal number' },
        min: { args: [0], msg: 'Group price must be at least 0' },
      },
    },
    ImageFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'Image file path must be a valid URL' },
      },
    },
    CourseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'CourseId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    timestamps: false,
  });

  Group.associate = (models) => {
    Group.belongsToMany(models.Student, {
      through: models.GroupStudent, 
      foreignKey: 'GroupId', 
      otherKey: 'StudentId',
      as: 'Students'
    });
    Group.belongsTo(models.Course, {
      foreignKey: 'CourseId',
      as: 'Courses',
  });
  };
  
 
  return Group;
};