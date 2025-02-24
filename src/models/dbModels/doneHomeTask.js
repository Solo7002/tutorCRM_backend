module.exports = (sequelize, DataTypes) => {
  const DoneHomeTask = sequelize.define('DoneHomeTask', {
    DoneHomeTaskId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Mark: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: 'Mark must be an integer', },
        min: { args: [-1], msg: 'Mark cannot be less than -1', },
        max: { args: [100], msg: 'Mark cannot exceed 100', },
      },
    },
    DoneDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'Done date must be a valid date', },
      },
    }
  }, {
    timestamps: false,
  });

  return DoneHomeTask;
};  