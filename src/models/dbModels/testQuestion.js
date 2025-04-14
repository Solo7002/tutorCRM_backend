module.exports = (sequelize, DataTypes) => {
  const TestQuestion = sequelize.define('TestQuestion', {
    TestQuestionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    TestQuestionHeader: {
      type: DataTypes.TEXT,
      allowNull: true,
      
    },
    TestQuestionDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
       
    },
    ImagePath: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'ImagePath must be a valid URL' },
      },
    },
    AudioPath: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'AudioPath must be a valid URL' },
      },
    },
    TestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: false,
  });

  return TestQuestion;
};