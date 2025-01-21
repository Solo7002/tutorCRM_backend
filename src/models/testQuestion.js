module.exports = (sequelize, DataTypes) => {
    const TestQuestion = sequelize.define('TestQuestion', {
      question: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['single', 'multiple', 'text']]
        }
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {});
  
    TestQuestion.associate = (models) => {
      TestQuestion.belongsTo(models.test, {
        foreignKey: 'testId',
        as: 'test'
      });
    };
  
    return TestQuestion;
  };  