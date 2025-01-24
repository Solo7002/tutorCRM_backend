module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define('Location', {
      locationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
      },
      longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      timestamps: false,
    });
  
    return Location;
  };  