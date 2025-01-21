module.exports = (sequelize, DataTypes) => {
    const HomeTask = sequelize.define('HomeTask', {
      taskHeader: {
        type: DataTypes.STRING,
        allowNull: false
      },
      taskDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {});
  
    HomeTask.associate = (models) => {
      HomeTask.belongsTo(models.teacher, {
        foreignKey: 'teacherId',
        as: 'teacher'
      });
    };
  
    return HomeTask;
  };  