module.exports = (sequelize, DataTypes) => {
    const DoneHomeTask = sequelize.define('DoneHomeTask', {
      submissionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      result: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {});
  
    DoneHomeTask.associate = (models) => {
      DoneHomeTask.belongsTo(models.homeTask, {
        foreignKey: 'taskId',
        as: 'homeTask'
      });
      DoneHomeTask.belongsTo(models.student, {
        foreignKey: 'studentId',
        as: 'student'
      });
    };
  
    return DoneHomeTask;
  };  