module.exports = (sequelize, DataTypes) => {
    const MaterialVisibilityStudent = sequelize.define('MaterialVisibilityStudent', {}, {
      timestamps: false,
    });
  
    MaterialVisibilityStudent.associate = (models) => {
      MaterialVisibilityStudent.belongsTo(models.Material, {
        foreignKey: 'materialId',
        as: 'material'
      });
      MaterialVisibilityStudent.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student'
      });
    };
  
    return MaterialVisibilityStudent;
  };  