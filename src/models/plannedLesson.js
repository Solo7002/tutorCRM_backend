module.exports = (sequelize, DataTypes) => {
    const PlannedLesson = sequelize.define('PlannedLesson', {
      plannedLessonId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      lessonHeader: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lessonDescription: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      lessonPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    PlannedLesson.associate = (models) => {
      PlannedLesson.belongsTo(models.Group, {
        foreignKey: 'groupId',
        as: 'group'
      });
    };
  
    return PlannedLesson;
  };  