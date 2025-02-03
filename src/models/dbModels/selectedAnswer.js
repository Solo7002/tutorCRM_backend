module.exports = (sequelize, DataTypes) => {
  const SelectedAnswer = sequelize.define('SelectedAnswer', {
    SelectedAnswerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    timestamps: false,
  });

  return SelectedAnswer;
};  