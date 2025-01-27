module.exports = (sequelize, DataTypes) => {
  const HomeTask = sequelize.define('HomeTask', {
    HomeTaskId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    HomeTaskHeader: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'HomeTaskHeader cannot be empty' },
        len: { args: [1, 100], msg: 'HomeTaskHeader must be between 1 and 100 characters' },
      },
    },
    HomeTaskDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'HomeTaskHeader cannot be empty' },
        len: { args: [1, 100], msg: 'HomeTaskHeader must be between 1 and 100 characters' },
      },
    },
    StartDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'StartDate must be a valid date' },
        isBefore: {
          args: new Date().toISOString(),
          msg: 'StartDate must be before the current date and time',
        },
      },
    },
    DeadlineDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'DeadlineDate must be a valid date' },
        isAfter: {
          args: new Date().toISOString(),
          msg: 'DeadlineDate must be after the current date and time',
        },
        isDeadlineValid(value) {
          if (new Date(value) <= new Date(this.StartDate)) {
            throw new Error('DeadlineDate must be after StartDate');
          }
        },
      },
    },
    MaxMark: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'MaxMark must be an integer' },
        min: { args: [0], msg: 'MaxMark must be at least 0' },
        max: { args: [100], msg: 'MaxMark must be less than or equal to 100' },
      },
    },
    ImageFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: 'ImageFilePath must be a valid URL' },
      },
    },
    GroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'GroupId must be a valid integer' },
        notEmpty: { msg: 'GroupId cannot be empty' },
      },
    }
  }, {
    timestamps: false,
  });

  HomeTask.associate = (models) => {
    HomeTask.belongsTo(models.Group, {
      foreignKey: 'GroupId',
      as: 'Group'
    });
  };

  return HomeTask;
};