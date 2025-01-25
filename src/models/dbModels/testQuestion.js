module.exports = (sequelize, DataTypes) => {
  const TestQuestion = sequelize.define('TestQuestion', {
    TestQuestionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    TestQuestionHeader: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    TestQuestionDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ImagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    AudioPath: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    timestamps: false,
  });

  TestQuestion.associate = (models) => {
    TestQuestion.belongsTo(models.Test, {
      foreignKey: 'TestId',
      as: 'Test',
    });
  };

  return TestQuestion;
};