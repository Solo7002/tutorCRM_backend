module.exports = (sequelize, DataTypes) => {
  const DoneTest = sequelize.define('DoneTest', {
    DoneTestId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Mark: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Mark must be an integer', },
        min: { args: [0], msg: 'Mark cannot be less than 0', },
        max: { args: [100], msg: 'Mark cannot exceed 100', },
      },
    },
    DoneDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'Done date must be a valid date', },
      },
    },
    SpentTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
          msg: 'Spent time must be a valid time in HH:MM:SS format',
        },
      },
    }
  }, {
    timestamps: false,
  });

  DoneTest.associate = (models) => {
    DoneTest.belongsTo(models.Student, {
      foreignKey: 'StudentId',
      as: 'Student'
    });
    DoneTest.belongsTo(models.Test, {
      foreignKey: 'TestId',
      as: 'Test'
    });
  };

  return DoneTest;
};  