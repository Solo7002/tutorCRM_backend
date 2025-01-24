module.exports = (sequelize, DataTypes) => {
    const UserReview = sequelize.define('UserReview', {
      userReviewId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
    }, {
      timestamps: false,
    });
  
    UserReview.associate = (models) => {
      UserReview.belongsTo(models.User, {
        foreignKey: 'userIdFrom',
        as: 'author'
      });
      UserReview.belongsTo(models.User, {
        foreignKey: 'userIdFor',
        as: 'target'
      });
    };
  
    return UserReview;
  };  