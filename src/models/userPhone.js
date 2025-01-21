module.exports = (sequelize, DataTypes) => {
    const UserPhone = sequelize.define('UserPhone', {
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nickName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      socialNetworkName: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {});
  
    UserPhone.associate = (models) => {
      UserPhone.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'user'
      });
    };
  
    return UserPhone;
  };  