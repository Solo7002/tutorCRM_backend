module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define('Subscription', {
      subscriptionLevelId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
    }, {
      timestamps: false,
    });
  
    Subscription.associate = (models) => {
      Subscription.hasMany(models.Teacher, {
        foreignKey: 'subscriptionLevelId',
        as: 'teachers'
      });
    };
  
    return Subscription;
  };  