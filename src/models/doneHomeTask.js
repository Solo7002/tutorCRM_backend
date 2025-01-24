module.exports = (sequelize, DataTypes) => {
    const DoneHomeTask = sequelize.define('DoneHomeTask', {
      doneHomeTaskId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },mark: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      doneDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
    });
  
    DoneHomeTask.associate = (models) => {
      DoneHomeTask.belongsTo(models.HomeTask, {
        foreignKey: 'homeTaskId',
        as: 'homeTask'
      });
      DoneHomeTask.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student'
      });
    };
  
    return DoneHomeTask;
  };  