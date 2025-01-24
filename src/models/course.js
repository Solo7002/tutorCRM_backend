module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
      courseId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      courseName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      imageFilePath: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      timestamps: false,
    });
  
    Course.associate = (models) => {
      Course.belongsTo(models.Teacher, {
        foreignKey: 'teacherId',
        as: 'teacher'
      });
      Course.belongsTo(models.Subject, {
        foreignKey: 'subjectId',
        as: 'subject'
      });
      Course.belongsTo(models.Location, {
        foreignKey: 'locationId',
        as: 'location'
      });
    };
  
    return Course;
  };  