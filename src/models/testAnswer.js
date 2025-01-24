module.exports = (sequelize, DataTypes) => {
    const TestAnswer = sequelize.define('TestAnswer', {
      testAnswerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      answerText: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isRightAnswer: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    TestAnswer.associate = (models) => {
      TestAnswer.belongsTo(models.TestQuestion, {
        foreignKey: 'testQuestionId',
        as: 'testQuestion'
      });
      TestAnswer.belongsTo(models.SelectedAnswer, {
        foreignKey: 'selectedAnswerId',
        as: 'selectedAnswer'
      });
    };
  
    return TestAnswer;
  };  