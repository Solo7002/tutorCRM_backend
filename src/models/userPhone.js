module.exports = (sequelize, DataTypes) => {
    const UserPhone = sequelize.define('UserPhone', {
      userPhoneId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
    }, {
      timestamps: false,
    });
  
    UserPhone.associate = (models) => {
      UserPhone.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    };
  
    return UserPhone;
  };  