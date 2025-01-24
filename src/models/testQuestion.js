module.exports = (sequelize, DataTypes) => {
  const TestQuestion = sequelize.define('TestQuestion', {
    testQuestionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    testQuestionHeader: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    testQuestionDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    audioPath: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    timestamps: false,
  });

  TestQuestion.associate = (models) => {
    TestQuestion.belongsTo(models.Test, {
      foreignKey: 'testId',
      as: 'test',
    });
  };

  return TestQuestion;
};