module.exports = (sequelize, DataTypes) => {
    const DoneHomeTaskFile = sequelize.define('DoneHomeTaskFile', {
      HometaskFileId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      FilePath: {
        type: DataTypes.STRING,
        allowNull: true
      },
      FileName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    DoneHomeTaskFile.associate = (models) => {
      DoneHomeTaskFile.belongsTo(models.DoneHomeTask, {
        foreignKey: 'DoneHomeTaskId',
        as: 'DoneHomeTask'
      });
    };
  
    return DoneHomeTaskFile;
  };  