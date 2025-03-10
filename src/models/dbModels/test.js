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
    },
    DeadlineDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: 'DeadlineDate must be a valid date' },
      },
    },
    AttemptsTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: { msg: 'AttemptsTotal must be an integer' },
        min: { args: 1, msg: 'AttemptsTotal must be at least 1' },
      },
    },
    MaxMark: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    ShowAnswers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    TimeLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ImageFilePath: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    GroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'GroupId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  }, {
    timestamps: false,
  });

  return Test;
};