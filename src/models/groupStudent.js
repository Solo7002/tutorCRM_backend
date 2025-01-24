module.exports = (sequelize, DataTypes) => {
    const GroupStudent = sequelize.define('GroupStudent', {}, {
      timestamps: false,
    });
  
    GroupStudent.associate = (models) => {
      GroupStudent.belongsTo(models.Group, {
        foreignKey: 'groupId',
        as: 'group'
      });
      GroupStudent.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student'
      });
    };
  
    return GroupStudent;
  };  