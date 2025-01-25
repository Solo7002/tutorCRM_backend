module.exports = (sequelize, DataTypes) => {
    const MaterialVisibilityStudent = sequelize.define('MaterialVisibilityStudent', {}, {
      timestamps: false,
    });
  
    MaterialVisibilityStudent.associate = (models) => {
      MaterialVisibilityStudent.belongsTo(models.Material, {
        foreignKey: 'MaterialId',
        as: 'Material'
      });
      MaterialVisibilityStudent.belongsTo(models.Student, {
        foreignKey: 'StudentId',
        as: 'Student'
      });
    };
  
    return MaterialVisibilityStudent;
  };  