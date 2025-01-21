module.exports = (sequelize, DataTypes) => {
    const GroupStudent = sequelize.define('GroupStudent', {}, {});
  
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