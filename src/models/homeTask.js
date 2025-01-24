module.exports = (sequelize, DataTypes) => {
  const HomeTask = sequelize.define('HomeTask', {
    homeTaskId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    homeTaskHeader: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    homeTaskDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deadlineDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    maxMark: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: false,
  });

  HomeTask.associate = (models) => {
    HomeTask.belongsTo(models.Group, {
      foreignKey: 'groupId',
      as: 'group'
    });
  };

  return HomeTask;
};