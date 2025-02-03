module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define('Subject', {
      SubjectId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      SubjectName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'SubjectName cannot be empty' },
          len: { args: [1, 255], msg: 'SubjectName must be between 1 and 255 characters' },
        },
      }
    }, {
      timestamps: false,
    });
  
    return Subject;
  };  