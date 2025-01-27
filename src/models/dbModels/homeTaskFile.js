module.exports = (sequelize, DataTypes) => {
  const HomeTaskFile = sequelize.define('HomeTaskFile', {
    HomeTaskFileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    FilePath: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'FilePath must be a valid URL' },
      },
    },
    FileName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'FileName cannot be empty' },
        len: { args: [1, 255], msg: 'FileName must be between 1 and 255 characters' },
      },
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