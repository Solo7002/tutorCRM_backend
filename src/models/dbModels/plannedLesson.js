module.exports = (sequelize, DataTypes) => {
    const PlannedLesson = sequelize.define('PlannedLesson', {
      PlannedLessonId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      LessonHeader: {
        type: DataTypes.STRING,
        allowNull: false
      },
      LessonDescription: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      LessonPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      IsPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false
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