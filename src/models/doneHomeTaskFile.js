module.exports = (sequelize, DataTypes) => {
    const DoneHomeTaskFile = sequelize.define('DoneHomeTaskFile', {
      hometaskFileId: {
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
    }, {
      timestamps: false,
    });
  
    DoneHomeTaskFile.associate = (models) => {
      DoneHomeTaskFile.belongsTo(models.DoneHomeTask, {
        foreignKey: 'doneHomeTaskId',
        as: 'doneHomeTask'
      });
    };
  
    return DoneHomeTaskFile;
  };  