module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
      courseName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      imageFilePath: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {});
  
    Course.associate = (models) => {
      Course.belongsTo(models.teacher, {
        foreignKey: 'teacherId',
        as: 'teacher'
      });
      Course.belongsTo(models.subject, {
        foreignKey: 'subjectId',
        as: 'subject'
      });
      Course.belongsTo(models.group, {
        foreignKey: 'groupId',
        as: 'group'
      });
      Course.belongsTo(models.location, {
        foreignKey: 'locationId',
        as: 'location'
      });
    };
  
    return Course;
  };  