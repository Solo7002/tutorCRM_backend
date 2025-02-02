module.exports = (sequelize, DataTypes) => {
  const GroupStudent = sequelize.define('GroupStudent', {}, {
    timestamps: false,
  });

  return GroupStudent;
};  