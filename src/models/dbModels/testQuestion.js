module.exports = (sequelize, DataTypes) => {
  const TestQuestion = sequelize.define('TestQuestion', {
    TestQuestionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    TestQuestionHeader: {
      type: DataTypes.STRING(1500),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'TestQuestionHeader cannot be empty' },
      },
    },
    TestQuestionDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: { args: [1, 1000], msg: 'TestQuestionDescription must be between 1 and 1000 characters' },
      },
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