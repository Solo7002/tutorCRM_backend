module.exports = (sequelize, DataTypes) => {
    const HomeTaskFile = sequelize.define('HomeTaskFile', {
      homeTaskFileId: {
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
  
    HomeTaskFile.associate = (models) => {
      HomeTaskFile.belongsTo(models.HomeTask, {
        foreignKey: 'homeTaskId',
        as: 'homeTask'
      });
    };
  
    return HomeTaskFile;
  };  