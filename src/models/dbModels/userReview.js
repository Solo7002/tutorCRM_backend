module.exports = (sequelize, DataTypes) => {
  const UserReview = sequelize.define('UserReview', {
    UserReviewId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ReviewHeader: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'ReviewHeader cannot be empty' },
        len: { args: [1, 100], msg: 'ReviewHeader must be between 1 and 100 characters long' },
      },
    },
    ReviewText: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'ReviewText cannot be empty' },
        len: { args: [1, 1000], msg: 'ReviewText must be between 1 and 1000 characters long' },
      },
    },
    CreateDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'CreateDate must be a valid date' },
      },
    },
    UserIdFrom: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserIdFor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Stars: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
  }, {
    timestamps: false,
  });

  return UserReview;
};