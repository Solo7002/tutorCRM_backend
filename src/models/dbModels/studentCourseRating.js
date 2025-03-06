module.exports = (sequelize, DataTypes) => {
  const StudentCourseRating = sequelize.define('StudentCourseRating', {
    Rating: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'Rating must be a valid decimal number' },
        min: { args: [0], msg: 'Rating must be greater than or equal to 0' },
        max: { args: [5], msg: 'Rating must be less than or equal to 5' },
      },
    },
    StudentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    CourseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'StudentsCourseRating',
    timestamps: false,
  });
  
  return StudentCourseRating;
};