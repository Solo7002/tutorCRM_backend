module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
      CourseId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      CourseName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ImageFilePath: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      timestamps: false,
    });
  
    Course.associate = (models) => {
      Course.belongsTo(models.Teacher, {
        foreignKey: 'TeacherId',
        as: 'Teacher'
      });
      Course.belongsTo(models.Subject, {
        foreignKey: 'SubjectId',
        as: 'Subject'
      });
      Course.belongsTo(models.Location, {
        foreignKey: 'LocationId',
        as: 'Location'
      });
    };
  
    return Course;
  };  