module.exports = (sequelize, DataTypes) => {
  const MaterialVisibilityStudent = sequelize.define('MaterialVisibilityStudent', {}, {
    timestamps: false,
  });

  return MaterialVisibilityStudent;
};  