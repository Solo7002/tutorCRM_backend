module.exports = (sequelize, DataTypes) => {
    const BlockedUser = sequelize.define('BlockedUser', {
      BlockedId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ReasonDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      BanStartDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      BanEndDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      timestamps: false,
    });
  
    BlockedUser.associate = (models) => {
      BlockedUser.belongsTo(models.User, {
        foreignKey: 'UserId',
        as: 'User'
      });
    };
  
    return BlockedUser;
  };  