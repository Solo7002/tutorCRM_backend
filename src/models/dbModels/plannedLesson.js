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
    LessonDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: { args: [1, 1000], msg: 'LessonDescription must be between 1 and 1000 characters' },
      },
    },
    LessonPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: { msg: 'LessonPrice must be a valid decimal number' },
        min: { args: [0], msg: 'LessonPrice must be greater than or equal to 0' },
      },
    },
    IsPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        isIn: { args: [[true, false]], msg: 'IsPaid must be either true or false' },
      },
    },
    LessonDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: 'LessonDate must be a valid date' },
      },
    },
    LessonTime: {
      type: DataTypes.STRING, // Время в формате 'HH:MM - HH:MM'
      allowNull: false,
      validate: {
        notEmpty: { msg: 'LessonTime cannot be empty' },
        is: /^([0-9]{2}:[0-9]{2} - [0-9]{2}:[0-9]{2})$/, // Валидация формата времени
        len: { args: [1, 20], msg: 'LessonTime must be between 1 and 20 characters' },
      },
    },
    TimeZone: {
      type: DataTypes.STRING, // Часовой пояс
      allowNull: false,
      defaultValue: 'UTC',
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