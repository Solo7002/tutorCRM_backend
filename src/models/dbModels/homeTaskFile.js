module.exports = (sequelize, DataTypes) => {
    const HomeTaskFile = sequelize.define('HomeTaskFile', {
      HomeTaskFileId: {
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
  
    HomeTaskFile.associate = (models) => {
      HomeTaskFile.belongsTo(models.HomeTask, {
        foreignKey: 'HomeTaskId',
        as: 'HomeTask'
      });
    };
  
    return HomeTaskFile;
  };  