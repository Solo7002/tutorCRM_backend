module.exports = (sequelize, DataTypes) => {
    const BlockedUser = sequelize.define('BlockedUser', {
      blockedId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reasonDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      banStartDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      banEndDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      timestamps: false,
    });
  
    BlockedUser.associate = (models) => {
      BlockedUser.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    };
  
    return BlockedUser;
  };  