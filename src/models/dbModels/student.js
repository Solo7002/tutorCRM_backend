module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        StudentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        SchoolName: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: { args: [1, 255], msg: 'SchoolName must be between 1 and 255 characters' },
            },
            defaultValue: "-1"
        },
        Grade: {
            type: DataTypes.STRING,
            allowNull: true,
             validate: {
                len: { args: [1, 50], msg: 'Grade must be between 1 and 50 characters' },
            },
            defaultValue: "-1"
        },
        UserId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
    }, {
        timestamps: false,
    });


    Student.associate = (models) => {
        Student.belongsToMany(models.Group, {
          through: models.GroupStudent, 
          foreignKey: 'StudentId', 
          otherKey: 'GroupId',
          as: 'Groups'
        });
      };
      

    return Student;
};  