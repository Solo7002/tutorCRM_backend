module.exports = (sequelize, DataTypes) => {
  const StudentCourseRating = sequelize.define('StudentCourseRating', {
    Rating: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'Rating must be a valid decimal number' },
        min: { args: [0], msg: 'Rating must be greater than or equal to 0' },
        max: { args: [10], msg: 'Rating must be less than or equal to 10' },
      },
    }
  }, {
    timestamps: false,
  });
  
  return StudentCourseRating;
};  