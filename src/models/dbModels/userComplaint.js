module.exports = (sequelize, DataTypes) => {
  const UserComplaint = sequelize.define('UserComplaint', {
    UserComplaintId: {
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
        notEmpty: { msg: 'ComplaintDescription cannot be empty' },
        len: { args: [1, 1000], msg: 'ComplaintDescription must be between 1 and 1000 characters' },
      },
    }
  }, {
    timestamps: false,
  });

  return UserComplaint;
};  