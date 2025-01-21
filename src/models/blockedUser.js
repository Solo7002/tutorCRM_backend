module.exports = (sequelize, DataTypes) => {
    const BlockedUser = sequelize.define('BlockedUser', {
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
    }, {});
  
    BlockedUser.associate = (models) => {
      BlockedUser.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'user'
      });
    };
  
    return BlockedUser;
  };  