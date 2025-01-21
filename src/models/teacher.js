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
    Teacher.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user'
    });
    Teacher.hasMany(models.course, {
      foreignKey: 'teacherId',
      as: 'courses'
    });
  };

  return Teacher;
};