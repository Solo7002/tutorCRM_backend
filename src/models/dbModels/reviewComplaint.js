module.exports = (sequelize, DataTypes) => {
    const ReviewComplaint = sequelize.define('ReviewComplaint', {
      ReviewComplaintId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ComplaintDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      ComplaintDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    ReviewComplaint.associate = (models) => {
      ReviewComplaint.belongsTo(models.User, {
        foreignKey: 'UserFromId',
        as: 'UserFrom'
      });
      ReviewComplaint.belongsTo(models.UserReview, {
        foreignKey: 'ReviewId',
        as: 'Review'
      });
    };
  
    return ReviewComplaint;
  };  