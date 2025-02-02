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
    }
  }, {
    timestamps: false,
  });
  
  return Course;
};  