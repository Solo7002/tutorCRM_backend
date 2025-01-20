module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
      schoolName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {});
  
    Student.associate = (models) => {
      Student.belongsTo(models.User, {
        foreignKey: 'FK_UserId',
        as: 'user'
      });
    };
  
    return Student;
  };
  