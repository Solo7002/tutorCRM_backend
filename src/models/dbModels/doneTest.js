module.exports = (sequelize, DataTypes) => {
    const DoneTest = sequelize.define('DoneTest', {
      DoneTestId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Mark: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      DoneDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      SpentTime: {
        type: DataTypes.TIME,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    DoneTest.associate = (models) => {
      DoneTest.belongsTo(models.Student, {
        foreignKey: 'StudentId',
        as: 'Student'
      });
      DoneTest.belongsTo(models.Test, {
        foreignKey: 'TestId',
        as: 'Test'
      });
    };
  
    return DoneTest;
  };  