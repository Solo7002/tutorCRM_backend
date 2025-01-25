module.exports = (sequelize, DataTypes) => {
    const StudentCourseRating = sequelize.define('StudentCourseRating', {
      Rating: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    StudentCourseRating.associate = (models) => {
      StudentCourseRating.belongsTo(models.Student, {
        foreignKey: 'StudentId',
        as: 'Student'
      });
      StudentCourseRating.belongsTo(models.Course, {
        foreignKey: 'CourseId',
        as: 'Course'
      });
    };
  
    return StudentCourseRating;
  };  