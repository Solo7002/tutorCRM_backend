module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
      SubscriptionLevelId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      SubscriptionName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      SubscriptionDescription: {
        type: DataTypes.STRING,
        allowNull: true
      },
      SubscriptionPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    Subscription.associate = (models) => {
      Subscription.hasMany(models.Teacher, {
        foreignKey: 'SubscriptionLevelId',
        as: 'Teachers'
      });
    };
  
    return Subscription;
  };  