module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    TestId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    TestName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'TestName cannot be empty' },
        len: { args: [1, 255], msg: 'TestName must be between 1 and 255 characters' },
      },
    },
    TestDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: { args: [1, 1000], msg: 'TestDescription must be between 1 and 1000 characters' },
      },
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'CreatedDate must be a valid date' },
      },
    }
  }, {
    timestamps: false,
  });

  return Test;
};  