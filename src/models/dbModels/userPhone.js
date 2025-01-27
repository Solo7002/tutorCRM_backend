module.exports = (sequelize, DataTypes) => {
  const UserPhone = sequelize.define('UserPhone', {
    UserPhoneId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'PhoneNumber cannot be empty' },
        is: {
          args: /^[+]?(\d[\d\(\)\- ]{5,15}\d)$/,
          msg: 'PhoneNumber must be a valid phone number(Example: +1 123-456-7890 or (123) 456-7890 or 123 456 7890.)',
        },
      },
    },
    NickName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [1, 100], msg: 'NickName should be between 1 and 100 characters' },
      },
    },
    SocialNetworkName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [1, 100], msg: 'SocialNetworkName should be between 1 and 100 characters' },
      },
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