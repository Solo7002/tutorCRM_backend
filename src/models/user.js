module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      imageFilePath: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {});
  
    User.associate = (models) => {
      User.hasOne(models.Student, {
        foreignKey: 'FK_UserId',
        as: 'student'
      });
      User.hasOne(models.Teacher, {
        foreignKey: 'FK_UserId',
        as: 'teacher'
      });
    };
  
    return User;
  };
  