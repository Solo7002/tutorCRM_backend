module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define('Test', {
      testId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      testName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      testDescription: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
    });
  
    Test.associate = (models) => {
      Test.belongsTo(models.Group, {
        foreignKey: 'groupId',
        as: 'groups'
      });
    };
  
    return Test;
  };  