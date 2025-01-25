module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define('Location', {
      LocationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      City: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Country: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
      },
      Longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: true
      },
      Address: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      timestamps: false,
    });
  
    return Location;
  };  