module.exports = (sequelize, DataTypes) => {
  const PlannedLesson = sequelize.define('PlannedLesson', {
    PlannedLessonId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    LessonHeader: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'LessonHeader cannot be empty' },
        len: { args: [1, 255], msg: 'LessonHeader must be between 1 and 255 characters' },
      },
    },
    StartLessonTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    EndLessonTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStartTime(value) {
          if (value <= this.StartLessonTime) {
            throw new Error('EndLessonTime must be after StartLessonTime');
          }
        },
      }
    },
    LessonDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    LessonType: {
      type: DataTypes.ENUM('online', 'offline'), 
      allowNull: false,
      defaultValue: 'offline',
      validate: {
        isIn: {
          args: [['online', 'offline']],
          msg: 'LessonType must be either "online" or "offline"',
        },
      },
    },
    LessonAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [1, 255], msg: 'LessonAddress must be between 1 and 255 characters' },
      },
    },
    LessonLink: {
      type: DataTypes.STRING, 
      allowNull: true,
      validate: {
        isUrl: { msg: 'LessonLink must be a valid URL' },
        len: { args: [1, 255], msg: 'LessonLink must be between 1 and 255 characters' },
      },
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
    tableName: 'PlannedLessons',
    timestamps: false,
  });

  PlannedLesson.associate = (models) => {
    PlannedLesson.belongsTo(models.Group, {
      foreignKey: 'GroupId',
      as: 'Group',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    PlannedLesson.belongsTo(models.Teacher, {
      foreignKey: 'TeacherId',
      as: 'Teacher',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return PlannedLesson;
};