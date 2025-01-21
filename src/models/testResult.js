module.exports = (sequelize, DataTypes) => {
    const TestResult = sequelize.define('TestResult', {
      resultDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {});
  
    TestResult.associate = (models) => {
      TestResult.belongsTo(models.test, {
        foreignKey: 'testId',
        as: 'test'
      });
      TestResult.belongsTo(models.student, {
        foreignKey: 'studentId',
        as: 'student'
      });
    };
  
    return TestResult;
  };  