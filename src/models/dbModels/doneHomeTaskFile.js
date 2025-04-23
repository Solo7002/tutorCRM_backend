module.exports = (sequelize, DataTypes) => {
  const DoneHomeTaskFile = sequelize.define('DoneHomeTaskFile', {
    HometaskFileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    FilePath: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    FileName: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'FileName cannot be empty' },
      },
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    timestamps: false,
  });

  return DoneHomeTaskFile;
};  