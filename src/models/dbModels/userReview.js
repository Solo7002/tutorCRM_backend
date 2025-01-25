module.exports = (sequelize, DataTypes) => {
    const UserReview = sequelize.define('UserReview', {
      UserReviewId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ReviewHeader: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ReviewText: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      CreateDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
    });
  
    UserReview.associate = (models) => {
      UserReview.belongsTo(models.User, {
        foreignKey: 'UserIdFrom',
        as: 'Author'
      });
      UserReview.belongsTo(models.User, {
        foreignKey: 'UserIdFor',
        as: 'Target'
      });
    };
  
    return UserReview;
  };  