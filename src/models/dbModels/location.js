module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    LocationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    City: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'City cannot be empty' },
        len: { args: [1, 100], msg: 'City must be between 1 and 100 characters' },
      },
    },
    Country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Country cannot be empty' },
        len: { args: [1, 100], msg: 'Country must be between 1 and 100 characters' },
      },
    },
    Latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      validate: {
        isDecimal: { msg: 'Latitude must be a valid decimal number' },
        min: { args: [-90], msg: 'Latitude must be between -90 and 90' },
        max: { args: [90], msg: 'Latitude must be between -90 and 90' },
      },
    },
    Longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
      validate: {
        isDecimal: { msg: 'Longitude must be a valid decimal number' },
        min: { args: [-180], msg: 'Longitude must be between -180 and 180' },
        max: { args: [180], msg: 'Longitude must be between -180 and 180' },
      },
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [1, 255], msg: 'Address must be between 1 and 255 characters' },
      },
    }
  }, {
    timestamps: false,
  });

  return Location;
};  