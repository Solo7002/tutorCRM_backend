module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
      subscriptionName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subscriptionDescription: {
        type: DataTypes.STRING,
        allowNull: true
      },
      subscriptionPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {});
  
    Subscription.associate = (models) => {
      Subscription.hasMany(models.teacher, {
        foreignKey: 'subscriptionLevelId',
        as: 'teachers'
      });
    };
  
    return Subscription;
  };  