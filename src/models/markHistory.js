module.exports = (sequelize, DataTypes) => {
    const MarkHistory = sequelize.define('MarkHistory', {
      markId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      mark: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      markType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['test', 'homework']]
        }
      },
      markDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {});
  
    MarkHistory.associate = (models) => {
      MarkHistory.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student'
      });
      MarkHistory.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course'
      });
    };
  
    return MarkHistory;
  };