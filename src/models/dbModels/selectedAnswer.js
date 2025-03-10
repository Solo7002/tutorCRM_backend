module.exports = (sequelize, DataTypes) => {
  const SelectedAnswer = sequelize.define('SelectedAnswer', {
    SelectedAnswerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    TestQuestionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DoneTestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TestAnswerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: false,
  });

  return SelectedAnswer;
};