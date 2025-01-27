module.exports = (sequelize, DataTypes) => {
  const PlannedLesson = sequelize.define('PlannedLesson', {
    PlannedLessonId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      allowNull: false,
      validate: {
        isDecimal: { msg: 'LessonPrice must be a valid decimal number' },
        min: { args: [0], msg: 'LessonPrice must be greater than or equal to 0' },
      },
    },
    IsPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'IsPaid must be either true or false',
        },
      },
    }
  }, {
    timestamps: false,
  });

  PlannedLesson.associate = (models) => {
    PlannedLesson.belongsTo(models.Group, {
      foreignKey: 'GroupId',
      as: 'Group'
    });
  };

  return PlannedLesson;
};  