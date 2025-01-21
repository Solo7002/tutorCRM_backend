module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define('Test', {
      testHeader: {
        type: DataTypes.STRING,
        allowNull: false
      },
      testDescription: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {});
  
    Test.associate = (models) => {
      Test.belongsTo(models.teacher, {
        foreignKey: 'creatorId',
        as: 'creator'
      });
    };
  
    return Test;
  };  