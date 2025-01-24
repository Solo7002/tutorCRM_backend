module.exports = (sequelize, DataTypes) => {
    const ReviewComplaint = sequelize.define('ReviewComplaint', {
      reviewComplaintId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      complaintDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      complaintDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    ReviewComplaint.associate = (models) => {
      ReviewComplaint.belongsTo(models.User, {
        foreignKey: 'userFromId',
        as: 'userFrom'
      });
      ReviewComplaint.belongsTo(models.UserReview, {
        foreignKey: 'reviewId',
        as: 'review'
      });
    };
  
    return ReviewComplaint;
  };  