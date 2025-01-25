module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define('Subject', {
      SubjectId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      SubjectName: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: false,
    });
  
    return Subject;
  };  