module.exports = (sequelize, DataTypes) => {
  const DoneHomeTaskFile = sequelize.define('DoneHomeTaskFile', {
    HometaskFileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    FilePath: {
      type: DataTypes.STRING,
      allowNull: true,
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

  return DoneHomeTaskFile;
};  