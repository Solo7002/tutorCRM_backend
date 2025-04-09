module.exports = (sequelize, DataTypes) => {
  const MaterialVisibilityStudent = sequelize.define('MaterialVisibilityStudent', {
    MaterialId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Materials',
        key: 'MaterialId'
      },
      onDelete: 'CASCADE'
    },
    StudentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Students',
        key: 'StudentId'
      },
      onDelete: 'CASCADE'
    }
  }, {
    timestamps: false,
    tableName: 'MaterialVisibilityStudents',
  });

  return MaterialVisibilityStudent;
};