module.exports = (sequelize, DataTypes) => {
    const UserPhone = sequelize.define('UserPhone', {
      UserPhoneId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      PhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      NickName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      SocialNetworkName: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      timestamps: false,
    });
  
    UserPhone.associate = (models) => {
      UserPhone.belongsTo(models.User, {
        foreignKey: 'UserId',
        as: 'User'
      });
    };
  
    return UserPhone;
  };  