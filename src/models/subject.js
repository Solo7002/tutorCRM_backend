module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define('Subject', {
      subjectId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      subjectName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    return Subject;
  };  