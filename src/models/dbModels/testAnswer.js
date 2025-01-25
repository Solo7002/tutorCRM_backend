module.exports = (sequelize, DataTypes) => {
    const TestAnswer = sequelize.define('TestAnswer', {
      TestAnswerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      AnswerText: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      ImagePath: {
        type: DataTypes.STRING,
        allowNull: true
      },
      IsRightAnswer: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    TestAnswer.associate = (models) => {
      TestAnswer.belongsTo(models.TestQuestion, {
        foreignKey: 'TestQuestionId',
        as: 'TestQuestion'
      });
      TestAnswer.belongsTo(models.SelectedAnswer, {
        foreignKey: 'SelectedAnswerId',
        as: 'SelectedAnswer'
      });
    };
  
    return TestAnswer;
  };  