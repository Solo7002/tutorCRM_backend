module.exports = (sequelize, DataTypes) => {
  const MarkHistory = sequelize.define('MarkHistory', {
    MarkId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Mark: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Mark must be an integer' },
        min: { args: [0], msg: 'Mark must be greater than or equal to 0' },
        max: { args: [100], msg: 'Mark must be less than or equal to 100' },
      },
    },
    MarkType: {
      type: DataTypes.ENUM('test', 'homework'),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'MarkType cannot be empty' },
      },
    },
    MarkDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'MarkDate must be a valid date' },
      },
    }
  }, {
    timestamps: false,
  });

  return MarkHistory;
};