module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    CourseId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CourseName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'CourseName cannot be empty' },
        len: { args: [1, 255], msg: 'CourseName must be between 1 and 255 characters' },
      },
    },
    ImageFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'ImageFilePath must be a valid URL' },
      },
    },
    LocationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Locations',
        key: 'LocationId',
      },
      defaultValue:1,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    SubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Subjects',
        key: 'SubjectId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    TeacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Teachers',
        key: 'TeacherId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    timestamps: false,
  });

  Course.associate = (models) => {
    Course.hasMany(models.Group, {
      foreignKey: 'CourseId',
      as: 'Groups',
    });

    Course.belongsTo(models.Teacher, {
      foreignKey: 'TeacherId',
      as: 'Teacher',
    });

    Course.belongsTo(models.Location, {
      foreignKey: 'LocationId',
      as: 'Location',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Course.belongsTo(models.Subject, {
      foreignKey: 'SubjectId',
      as: 'Subject',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Course;
};