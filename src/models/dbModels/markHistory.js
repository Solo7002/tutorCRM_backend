module.exports = (sequelize, DataTypes) => {
    const MarkHistory = sequelize.define('MarkHistory', {
      MarkId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      Mark: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      MarkType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['test', 'homework']]
        }
      },
      MarkDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
    });
  
    MarkHistory.associate = (models) => {
      MarkHistory.belongsTo(models.Student, {
        foreignKey: 'StudentId',
        as: 'Student'
      });
      MarkHistory.belongsTo(models.Course, {
        foreignKey: 'CourseId',
        as: 'Course'
      });
    };
  
    return MarkHistory;
  };