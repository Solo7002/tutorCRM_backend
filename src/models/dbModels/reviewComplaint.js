module.exports = (sequelize, DataTypes) => {
  const ReviewComplaint = sequelize.define('ReviewComplaint', {
    ReviewComplaintId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ComplaintDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'ComplaintDate must be a valid date' },
      },
    },
    ComplaintDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: { args: [1, 1000], msg: 'ComplaintDescription must be between 1 and 1000 characters' },
      },
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