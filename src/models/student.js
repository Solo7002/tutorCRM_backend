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
    Student.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Student;
};