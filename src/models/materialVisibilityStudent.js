module.exports = (sequelize, DataTypes) => {
    const MaterialVisibilityStudent = sequelize.define('MaterialVisibilityStudent', {}, {});
  
    MaterialVisibilityStudent.associate = (models) => {
      MaterialVisibilityStudent.belongsTo(models.material, {
        foreignKey: 'materialId',
        as: 'material'
      });
      MaterialVisibilityStudent.belongsTo(models.student, {
        foreignKey: 'studentId',
        as: 'student'
      });
    };
  
    return MaterialVisibilityStudent;
  };  