module.exports = (sequelize, DataTypes) => {
    const Teacher = sequelize.define('Teacher', {
      aboutTeacher: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lessonPrice: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      lessonType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['group', 'solo']]
        }
      },
      meetingType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['offline', 'online']]
        }
      }
    }, {});
  
    Teacher.associate = (models) => {
      Teacher.belongsTo(models.User, {
        foreignKey: 'FK_UserId',
        as: 'user'
      });
    };
  
    return Teacher;
  };
  