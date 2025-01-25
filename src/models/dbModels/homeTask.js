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
    },
    HomeTaskDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    StartDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    DeadlineDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    MaxMark: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ImageFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    GroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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