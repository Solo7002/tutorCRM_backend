module.exports = (sequelize, DataTypes) => {
    const UserReview = sequelize.define('UserReview', {
      reviewHeader: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reviewText: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {});
  
    UserReview.associate = (models) => {
      UserReview.belongsTo(models.user, {
        foreignKey: 'userIdFrom',
        as: 'author'
      });
      UserReview.belongsTo(models.user, {
        foreignKey: 'userIdFor',
        as: 'target'
      });
    };
  
    return UserReview;
  };  