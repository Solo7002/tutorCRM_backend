module.exports = (sequelize, DataTypes) => {
    const ReviewComplaint = sequelize.define('ReviewComplaint', {
      complaintDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      complaintDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {});
  
    ReviewComplaint.associate = (models) => {
      ReviewComplaint.belongsTo(models.user, {
        foreignKey: 'userFromId',
        as: 'userFrom'
      });
      ReviewComplaint.belongsTo(models.userReview, {
        foreignKey: 'reviewId',
        as: 'review'
      });
    };
  
    return ReviewComplaint;
  };  