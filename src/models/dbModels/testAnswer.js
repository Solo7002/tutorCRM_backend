module.exports = (sequelize, DataTypes) => {
  const TestAnswer = sequelize.define('TestAnswer', {
    TestAnswerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    AnswerText: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: { args: [1, 1000], msg: 'AnswerText must be between 1 and 1000 characters' },
      },
    },
    ImagePath: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'ImagePath must be a valid URL' },
      },
    },
    IsRightAnswer: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    timestamps: false,
  });

  return TestAnswer;
};  