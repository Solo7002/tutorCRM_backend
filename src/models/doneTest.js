module.exports = (sequelize, DataTypes) => {
    const DoneTest = sequelize.define('DoneTest', {
      doneTestId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      mark: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      doneDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      spentTime: {
        type: DataTypes.TIME,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    DoneTest.associate = (models) => {
      DoneTest.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student'
      });
      DoneTest.belongsTo(models.Test, {
        foreignKey: 'testId',
        as: 'test'
      });
    };
  
    return DoneTest;
  };  