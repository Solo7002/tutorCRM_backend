module.exports = (sequelize, DataTypes) => {
    const DoneHomeTask = sequelize.define('DoneHomeTask', {
      DoneHomeTaskId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Mark: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DoneDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
    });
  
    DoneHomeTask.associate = (models) => {
      DoneHomeTask.belongsTo(models.HomeTask, {
        foreignKey: 'HomeTaskId',
        as: 'HomeTask'
      });
      DoneHomeTask.belongsTo(models.Student, {
        foreignKey: 'StudentId',
        as: 'Student'
      });
    };
  
    return DoneHomeTask;
  };  