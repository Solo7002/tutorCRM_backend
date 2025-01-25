module.exports = (sequelize, DataTypes) => {
    const GroupStudent = sequelize.define('GroupStudent', {}, {
      timestamps: false,
    });
  
    GroupStudent.associate = (models) => {
      GroupStudent.belongsTo(models.Group, {
        foreignKey: 'GroupId',
        as: 'Group'
      });
      GroupStudent.belongsTo(models.Student, {
        foreignKey: 'StudentId',
        as: 'Student'
      });
    };
  
    return GroupStudent;
  };  