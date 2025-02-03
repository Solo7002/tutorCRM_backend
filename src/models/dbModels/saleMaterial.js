module.exports = (sequelize, DataTypes) => {
  const SaleMaterial = sequelize.define('SaleMaterial', {
    SaleMaterialId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    MaterialsHeader: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'MaterialsHeader cannot be empty' },
        len: { args: [1, 255], msg: 'MaterialsHeader must be between 1 and 255 characters' },
      },
    },
    MaterialsDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'MaterialsDescription cannot be empty' },
        len: { args: [1, 1000], msg: 'MaterialsDescription must be between 1 and 1000 characters' },
      },
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'CreatedDate must be a valid date' },
      },
    },
    PreviewImagePath: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'PreviewImagePath must be a valid URL' },
      },
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'Price must be a valid decimal number' },
        min: { args: [0], msg: 'Price must be greater than or equal to 0' },
      },
    }
  }, {
    timestamps: false,
  });

  return SaleMaterial;
};  