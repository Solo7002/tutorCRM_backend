module.exports = (sequelize, DataTypes) => {
  const SaleMaterialFile = sequelize.define('SaleMaterialFile', {
    SaleMaterialFileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    FilePath: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'FilePath cannot be empty' },
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
    },
    AppearedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'AppearedDate must be a valid date' },
      },
    }
  }, {
    timestamps: false,
  });

  return SaleMaterialFile;
};  