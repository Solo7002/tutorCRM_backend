module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
      SubscriptionLevelId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      SubscriptionName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'SubscriptionName cannot be empty' },
            len: { args: [1, 100], msg: 'SubscriptionName must be between 1 and 100 characters' },
        },
      },
      SubscriptionDescription: {
        type: DataTypes.STRING,
        allowNull: true
      },
      SubscriptionPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            isDecimal: { msg: 'SubscriptionPrice must be a valid decimal number' },
        },
      }
    }, {
      timestamps: false,
    });
  
    return Subscription;
  };  