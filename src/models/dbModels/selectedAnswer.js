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

  SelectedAnswer.associate = (models) => {
    SelectedAnswer.belongsTo(models.TestQuestion, {
      foreignKey: 'TestQuestionId',
      as: 'TestQuestion'
    });
    SelectedAnswer.belongsTo(models.DoneTest, {
      foreignKey: 'DoneTestId',
      as: 'DoneTest'
    });
  };

  return SelectedAnswer;
};  