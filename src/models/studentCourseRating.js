module.exports = (sequelize, DataTypes) => {
    const StudentCourseRating = sequelize.define('StudentCourseRating', {
      rating: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    StudentCourseRating.associate = (models) => {
      StudentCourseRating.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student'
      });
      StudentCourseRating.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course'
      });
    };
  
    return StudentCourseRating;
  };  