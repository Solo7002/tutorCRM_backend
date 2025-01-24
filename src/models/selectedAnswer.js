module.exports = (sequelize, DataTypes) => {
    const SelectedAnswer = sequelize.define('SelectedAnswer', {
      selectedAnswerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    }, {
      timestamps: false,
    });
  
    SelectedAnswer.associate = (models) => {
      SelectedAnswer.belongsTo(models.TestQuestion, {
        foreignKey: 'testQuestionId',
        as: 'testQuestion'
      });
      SelectedAnswer.belongsTo(models.DoneTest, {
        foreignKey: 'doneTestId',
        as: 'doneTest'
      });
    };
  
    return SelectedAnswer;
  };  