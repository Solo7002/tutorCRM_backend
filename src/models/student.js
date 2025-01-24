module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    studentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    schoolName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false,
  });

  Student.associate = (models) => {
    Student.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Student;
};