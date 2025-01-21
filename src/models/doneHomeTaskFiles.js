module.exports = (sequelize, DataTypes) => {
    const DoneHomeTaskFile = sequelize.define('DoneHomeTaskFile', {
      doneHomeTaskFileId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: true
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {});
  
    DoneHomeTaskFile.associate = (models) => {
      DoneHomeTaskFile.belongsTo(models.DoneHomeTask, {
        foreignKey: 'doneHomeTaskId',
        as: 'doneHomeTask'
      });
    };
  
    return DoneHomeTaskFile;
  };  