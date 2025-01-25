module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define('Test', {
      TestId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      TestName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      TestDescription: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      CreatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
    });
  
    Test.associate = (models) => {
      Test.belongsTo(models.Group, {
        foreignKey: 'GroupId',
        as: 'Groups'
      });
    };
  
    return Test;
  };  